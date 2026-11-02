package com.outerrim.workshop.builds;

import com.outerrim.workshop.catalog.CatalogPart;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
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

        insertSelections(buildId, selectedParts);
    }

    public List<BuildResponse> findAll() {
        return jdbcTemplate.query("""
                SELECT id, name, status
                FROM saved_builds
                ORDER BY created_at DESC, id
                """,
                (row, rowNumber) -> new BuildResponse(
                        row.getObject("id", UUID.class),
                        row.getString("name"),
                        row.getString("status")
                )
        );
    }

    public Optional<BuildDetailsResponse> findById(UUID buildId) {
        List<BuildResponse> builds = jdbcTemplate.query("""
                SELECT id, name, status
                FROM saved_builds
                WHERE id = ?
                """,
                (row, rowNumber) -> new BuildResponse(
                        row.getObject("id", UUID.class),
                        row.getString("name"),
                        row.getString("status")
                ),
                buildId
        );

        if (builds.isEmpty()) {
            return Optional.empty();
        }

        BuildResponse build = builds.get(0);

        List<BuildPartResponse> parts = jdbcTemplate.query("""
                SELECT
                    p.id,
                    p.name,
                    p.category_id,
                    m.name AS material_name,
                    p.background_color,
                    p.glow_color
                FROM build_parts bp
                JOIN parts p
                    ON p.id = bp.part_id
                    AND p.category_id = bp.category_id
                LEFT JOIN materials m
                    ON m.id = p.material_id
                WHERE bp.build_id = ?
                ORDER BY p.category_id, p.sort_order, p.id
                """,
                (row, rowNumber) -> new BuildPartResponse(
                        row.getString("id"),
                        row.getString("name"),
                        row.getString("category_id"),
                        row.getString("material_name"),
                        row.getString("background_color"),
                        row.getString("glow_color")
                ),
                buildId
        );

        return Optional.of(new BuildDetailsResponse(
                build.id(),
                build.name(),
                build.status(),
                parts
        ));
    }

    public boolean update(
            UUID buildId,
            String name,
            String status,
            List<CatalogPart> selectedParts
    ) {
        int changedRows = jdbcTemplate.update("""
                UPDATE saved_builds
                SET name = ?, status = ?
                WHERE id = ?
                """,
                name,
                status,
                buildId
        );

        if (changedRows == 0) {
            return false;
        }

        jdbcTemplate.update(
                "DELETE FROM build_parts WHERE build_id = ?",
                buildId
        );

        insertSelections(buildId, selectedParts);

        return true;
    }

    public boolean deleteById(UUID buildId) {
        return jdbcTemplate.update(
                "DELETE FROM saved_builds WHERE id = ?",
                buildId
        ) > 0;
    }

    private void insertSelections(
            UUID buildId,
            List<CatalogPart> selectedParts
    ) {
        for (CatalogPart part : selectedParts) {
            jdbcTemplate.update("""
                    INSERT INTO build_parts (
                        build_id, category_id, part_id
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