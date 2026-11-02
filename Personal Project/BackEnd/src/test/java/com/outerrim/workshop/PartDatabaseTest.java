package com.outerrim.workshop;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class PartDatabaseTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void returnsHiltAddedToTheDatabase() throws Exception {
        // Arrange: add a hilt that exists only in the database.
        jdbcTemplate.update("""
                INSERT INTO parts (
                    id,
                    name,
                    category_id,
                    material_id,
                    background_color,
                    sort_order
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                "test-database-hilt",
                "Database Test Hilt",
                "hilt",
                "steel",
                "#123456",
                99
        );

        // Act: request the available hilts through the API.
        String responseBody = mockMvc.perform(get("/api/parts.sbr"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert: the API must include the newly inserted hilt.
        List<String> ids = JsonPath.read(responseBody, "$[*].id");

        assertThat(ids).contains("test-database-hilt");
    }

    @Test
    void returnsACrystalAddedToTheDatabase() throws Exception {
        // Arrange
        jdbcTemplate.update("""
            INSERT INTO parts (
                id, name, category_id, glow_color, sort_order
            )
            VALUES (?, ?, ?, ?, ?)
            """,
                "test-database-crystal",
                "Database Test Crystal",
                "crystal",
                "#abcdef",
                99
        );

        // Act
        String responseBody = mockMvc.perform(get("/api/crystals.sbr"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        List<String> colors = JsonPath.read(
                responseBody,
                "$[?(@.id == 'test-database-crystal')].glowColor"
        );

        assertThat(colors).containsExactly("#abcdef");
    }

    @Test
    void returnsAnEmitterAddedToTheDatabase() throws Exception {
        // Arrange
        jdbcTemplate.update("""
            INSERT INTO parts (
                id, name, category_id, sort_order
            )
            VALUES (?, ?, ?, ?)
            """,
                "test-database-emitter",
                "Database Test Emitter",
                "emitter",
                99
        );

        // Act
        String responseBody = mockMvc.perform(get("/api/emitters.sbr"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        List<String> names = JsonPath.read(
                responseBody,
                "$[?(@.id == 'test-database-emitter')].name"
        );

        assertThat(names).containsExactly("Database Test Emitter");
    }
}