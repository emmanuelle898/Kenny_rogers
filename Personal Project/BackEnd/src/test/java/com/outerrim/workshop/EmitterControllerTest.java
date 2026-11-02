package com.outerrim.workshop;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EmitterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsAvailableEmitters() throws Exception {
        // Act
        String responseBody = mockMvc.perform(get("/api/emitters.sbr"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        List<String> emitterIds = JsonPath.read(
                responseBody,
                "$[*].id"
        );

        assertThat(emitterIds).containsExactlyInAnyOrder(
                "standard",
                "flared",
                "shrouded"
        );
    }
}