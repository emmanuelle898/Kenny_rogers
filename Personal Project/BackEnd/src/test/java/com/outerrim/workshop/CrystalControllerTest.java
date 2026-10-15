package com.outerrim.workshop;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc

class CrystalControllerTest{

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsAllAvailableCrystals() throws Exception{

        // Act
        String responseBody = mockMvc.perform(get("/api/crystals.sbr"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                        .andReturn().getResponse().getContentAsString();

        List<String> crystalIds = JsonPath.read(responseBody, "$[*].id");

                assertThat(crystalIds).containsExactlyInAnyOrder("violet", "blue", "yellow", "crimson",
                "orange", "green", "white", "black");

    }
}

