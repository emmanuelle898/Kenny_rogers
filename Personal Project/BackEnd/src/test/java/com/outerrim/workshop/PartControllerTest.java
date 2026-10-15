package com.outerrim.workshop;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsAvailableParts() throws Exception {
        // Act: request the available parts
        String responseBody = mockMvc.perform(get("/api/parts.sbr"))
                // Assert: check the response
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andReturn().getResponse().getContentAsString();

        System.out.println("Parts response: " + responseBody);

        List<String> hiltsId= JsonPath.read(responseBody,"$[*].id");

        assertThat(hiltsId).containsExactlyInAnyOrder("alloy","brass","steel","wood","gold");
    }

    @ParameterizedTest(name = "{0} has background color {1}")
    @CsvSource({
            "alloy, #273c2b",
            "brass, #c49e5b",
            "steel, #b5c0c9",
            "wood, #6c4223",
            "gold, #ffc30b"
    })
    void returnsColorForEachHilt(String id, String expectedColor)
            throws Exception {

        // Act
        String responseBody = mockMvc.perform(get("/api/parts.sbr"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andReturn().getResponse().getContentAsString();

        List<String> colors = JsonPath.read(
                responseBody,
                "$[?(@.id == '" + id + "')].backgroundColor"
        );

        // Assert
        assertThat(colors).containsExactly(expectedColor);
    }

}

