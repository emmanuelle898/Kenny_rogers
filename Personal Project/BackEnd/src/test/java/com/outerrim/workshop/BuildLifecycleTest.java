package com.outerrim.workshop;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class BuildLifecycleTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String ORIGINAL = """
            {
                "name": "Original saber",
                "status": "draft",
                "hiltId": "brass",
                "crystalId": "green",
                "emitterId": "flared"
            }
            """;

    private static final String UPDATED = """
            {
                "name": "Rebuilt saber",
                "status": "complete",
                "hiltId": "wood",
                "crystalId": "violet",
                "emitterId": "shrouded",
                "collarId": "collar-etched",
                "switchId": "switch-toggle",
                "pommelId": "pommel-crown"
            }
            """;

    private UUID createBuild() throws Exception {
        String body = mockMvc.perform(post("/api/builds.sbr")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ORIGINAL))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String id = JsonPath.read(body, "$.id");
        return UUID.fromString(id);
    }

    @Test
    void listsAndUpdatesAnExistingBuild() throws Exception {
        UUID id = createBuild();

        String listBody = mockMvc.perform(get("/api/builds.sbr"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<String> ids = JsonPath.read(listBody, "$[*].id");
        assertThat(ids).contains(id.toString());

        Long countBefore = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM saved_builds",
                Long.class
        );

        mockMvc.perform(put("/api/builds/{id}.sbr", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(UPDATED))
                .andExpect(status().isOk());

        String body = mockMvc.perform(get("/api/builds/{id}.sbr", id))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String name = JsonPath.read(body, "$.name");
        String buildStatus = JsonPath.read(body, "$.status");
        List<String> selectedIds = JsonPath.read(body, "$.parts[*].id");

        assertThat(name).isEqualTo("Rebuilt saber");
        assertThat(buildStatus).isEqualTo("complete");
        assertThat(selectedIds).containsExactlyInAnyOrder(
                "wood", "violet", "shrouded",
                "collar-etched", "switch-toggle", "pommel-crown"
        );

        assertThat(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM saved_builds",
                Long.class
        )).isEqualTo(countBefore);
    }

    @Test
    void deletesTheBuildAndSelectionsButKeepsCatalogParts() throws Exception {
        UUID id = createBuild();

        Long catalogCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM parts",
                Long.class
        );

        mockMvc.perform(delete("/api/builds/{id}.sbr", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/builds/{id}.sbr", id))
                .andExpect(status().isNotFound());

        assertThat(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM build_parts WHERE build_id = ?",
                Long.class,
                id
        )).isZero();

        assertThat(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM parts",
                Long.class
        )).isEqualTo(catalogCount);
    }

    @Test
    void rejectsAnInvalidUpdateWithoutChangingTheBuild() throws Exception {
        UUID id = createBuild();

        String invalid = UPDATED.replace(
                "\"switch-toggle\"",
                "\"green\""
        );

        mockMvc.perform(put("/api/builds/{id}.sbr", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalid))
                .andExpect(status().isBadRequest());

        assertThat(jdbcTemplate.queryForObject(
                "SELECT name FROM saved_builds WHERE id = ?",
                String.class,
                id
        )).isEqualTo("Original saber");

        List<String> parts = jdbcTemplate.queryForList(
                "SELECT part_id FROM build_parts WHERE build_id = ?",
                String.class,
                id
        );

        assertThat(parts).containsExactlyInAnyOrder(
                "brass", "green", "flared",
                "collar-smooth", "switch-stud", "pommel-flat"
        );
    }

    @Test
    void returns404ForUnknownBuilds() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(get("/api/builds/{id}.sbr", id))
                .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/builds/{id}.sbr", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(UPDATED))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/builds/{id}.sbr", id))
                .andExpect(status().isNotFound());
    }
}