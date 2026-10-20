package com.outerrim.workshop.builds;

import com.outerrim.workshop.catalog.CatalogPart;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class BuildRepository {

    private final JdbcTemplate jdbcTemplate;

    public BuildRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(
            UUID buildId,
            String name,
            String status,
            List<CatalogPart> selectedParts
    ) {
        jdbcTemplate.update("""
                INSERT INTO saved_builds (id, name, status)
                VALUES (?, ?, ?)
                """,
                buildId,
                name,
                status
        );

        for (CatalogPart part : selectedParts) {
            jdbcTemplate.update("""
                    INSERT INTO build_parts (
                        build_id,
                        category_id,
                        part_id
                    )
                    VALUES (?, ?, ?)
                    """,
                    buildId,
                    part.getCategoryId(),
                    part.getId()
            );
        }
    }
}