package com.outerrim.workshop;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void connectsToWorkshopDatabase() throws Exception {
        // Act
        try (
                Connection connection = dataSource.getConnection();
                Statement statement = connection.createStatement();
                ResultSet result = statement.executeQuery(
                        "SELECT current_database(), current_user"
                )
        ) {
            // Assert
            assertThat(result.next()).isTrue();
            assertThat(result.getString(1)).isEqualTo("workshop");
            assertThat(result.getString(2)).isEqualTo("builder");
        }
    }
}