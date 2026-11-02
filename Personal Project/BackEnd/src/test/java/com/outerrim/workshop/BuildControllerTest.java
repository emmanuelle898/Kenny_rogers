package com.outerrim.workshop;

import com.jayway.jsonpath.JsonPath;
import com.outerrim.workshop.builds.BuildController;
import com.outerrim.workshop.builds.BuildDetailsResponse;
import com.outerrim.workshop.builds.BuildPartResponse;
import com.outerrim.workshop.builds.BuildService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;


import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class BuildControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void createsABuildAndStoresItsSelectedParts() throws Exception {
        // Arrange: send the JSON expected by CreateBuildRequest.
        String requestBody = """
            {
                "name": "Desert Wanderer",
                "status": "draft",
                "hiltId": "brass",
                "crystalId": "green",
                "emitterId": "flared",
                "collarId": "collar-smooth",
                "switchId": "switch-stud",
                "pommelId": "pommel-flat"
            }
            """;

        // Act: submit the request.
        String responseBody = mockMvc.perform(
                        post("/api/builds.sbr")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody)
                )
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON
                ))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert: check the API response.
        String returnedId = JsonPath.read(responseBody, "$.id");
        String returnedName = JsonPath.read(responseBody, "$.name");
        String returnedStatus = JsonPath.read(responseBody, "$.status");

        assertThat(returnedId).isNotBlank();
        assertThat(returnedName).isEqualTo("Desert Wanderer");
        assertThat(returnedStatus).isEqualTo("draft");

        // Parsing also checks that the returned ID is a valid UUID.
        UUID buildId = UUID.fromString(returnedId);

        // Assert: the returned ID identifies the stored build.
        String storedName = jdbcTemplate.queryForObject(
                "SELECT name FROM saved_builds WHERE id = ?",
                String.class,
                buildId
        );

        assertThat(storedName).isEqualTo("Desert Wanderer");

        // Assert: all six selections were stored for this build.
        List<String> storedPartIds = jdbcTemplate.queryForList(
                "SELECT part_id FROM build_parts WHERE build_id = ?",
                String.class,
                buildId
        );

        assertThat(storedPartIds).containsExactlyInAnyOrder(
                "brass",
                "green",
                "flared",
                "collar-smooth",
                "switch-stud",
                "pommel-flat"
        );
    }

    @Test
    void retrievesASavedBuildWithItsComponentDetails() throws Exception {
        // Arrange: create a saved build.
        String requestBody = """
            {
                "name": "Desert Wanderer",
                "status": "draft",
                "hiltId": "brass",
                "crystalId": "green",
                "emitterId": "flared"
            }
            """;

        String createdBody = mockMvc.perform(
                        post("/api/builds.sbr")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody)
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String buildId = JsonPath.read(createdBody, "$.id");

        // Act: retrieve the saved build using its id
        String responseBody = mockMvc.perform(
                        get("/api/builds/{id}.sbr", buildId)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON
                ))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert: the correct build was retrieved
        String returnedId = JsonPath.read(responseBody, "$.id");
        String returnedName = JsonPath.read(responseBody, "$.name");
        String returnedStatus = JsonPath.read(responseBody, "$.status");

        assertThat(returnedId).isEqualTo(buildId);
        assertThat(returnedName).isEqualTo("Desert Wanderer");
        assertThat(returnedStatus).isEqualTo("draft");

        // Assert: all three selected parts were retrieved
        List<String> partIds = JsonPath.read(
                responseBody,
                "$.parts[*].id"
        );

        assertThat(partIds).containsExactlyInAnyOrder(
                "brass",
                "green",
                "flared",
                "collar-smooth",
                "switch-stud",
                "pommel-flat"
        );

        // Assert: the hilt includes its catalog and material details.
        List<String> hiltNames = JsonPath.read(
                responseBody,
                "$.parts[?(@.categoryId == 'hilt')].name"
        );

        List<String> materialNames = JsonPath.read(
                responseBody,
                "$.parts[?(@.categoryId == 'hilt')].materialName"
        );

        assertThat(hiltNames).containsExactly("Salvaged Brass");
        assertThat(materialNames).containsExactly("Brass");

        // Assert: the crystal includes its glow color.
        List<String> glowColors = JsonPath.read(
                responseBody,
                "$.parts[?(@.categoryId == 'crystal')].glowColor"
        );

        assertThat(glowColors).containsExactly("#33ff33");
    }

    @Test
    void returnsHtmlLikeNameAsJsonWithContentTypeProtection() throws Exception {
        // Arrange: a name that would be dangerous if rendered as raw HTML
        String requestBody = """
            {
                "name": "<img src=x onerror=alert(1)>",
                "status": "draft",
                "hiltId": "brass",
                "crystalId": "green",
                "emitterId": "flared"
            }
            """;

        // Act
        String responseBody = mockMvc.perform(
                        post("/api/builds.sbr")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody)
                )
                // Assert: the response is explicitly JSON.
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON
                ))
                .andExpect(header().string(
                        "X-Content-Type-Options",
                        "nosniff"
                ))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert: the name survives as a JSON string.
        String returnedName = JsonPath.read(responseBody, "$.name");

        assertThat(returnedName)
                .isEqualTo("<img src=x onerror=alert(1)>");
    }
    // This test was researched due to error in code I couldnt figure out

    @ParameterizedTest
    @CsvSource({
            "'', draft, brass",
            "Invalid status build, published, brass",
            "Unknown part build, draft, nonexistent-hilt",
            "Wrong category build, draft, green"
    })
    void rejectsInvalidBuildsWithoutSaving(
            String name,
            String buildStatus,
            String hiltId
    ) throws Exception {
        // Arrange: record how many rows already exist.
        Long buildsBefore = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM saved_builds",
                Long.class
        );

        Long selectionsBefore = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM build_parts",
                Long.class
        );

        String requestBody = """
            {
                "name": "%s",
                "status": "%s",
                "hiltId": "%s",
                "crystalId": "violet",
                "emitterId": "standard"
            }
            """.formatted(name, buildStatus, hiltId);

        // Act and Assert: reject the request.
        mockMvc.perform(
                        post("/api/builds.sbr")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody)
                )
                .andExpect(status().isBadRequest());

        // Assert: no build or selection rows were added.
        Long buildsAfter = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM saved_builds",
                Long.class
        );

        Long selectionsAfter = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM build_parts",
                Long.class
        );

        assertThat(buildsAfter).isEqualTo(buildsBefore);
        assertThat(selectionsAfter).isEqualTo(selectionsBefore);
    }
}