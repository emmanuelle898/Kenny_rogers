CREATE TABLE part_categories (
                                 id VARCHAR(40) PRIMARY KEY,
                                 name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE materials (
                           id VARCHAR(40) PRIMARY KEY,
                           name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE parts (
                       id VARCHAR(80) PRIMARY KEY,
                       name VARCHAR(120) NOT NULL,
                       category_id VARCHAR(40) NOT NULL,
                       material_id VARCHAR(40),
                       background_color VARCHAR(7),
                       glow_color VARCHAR(7),
                       sort_order INTEGER NOT NULL DEFAULT 0,

                       CONSTRAINT fk_parts_category
                           FOREIGN KEY (category_id)
                               REFERENCES part_categories(id),

                       CONSTRAINT fk_parts_material
                           FOREIGN KEY (material_id)
                               REFERENCES materials(id),

                       CONSTRAINT uq_parts_id_category
                           UNIQUE (id, category_id),

                       CONSTRAINT chk_parts_background_color
                           CHECK (
                               background_color IS NULL
                                   OR background_color ~ '^#[0-9A-Fa-f]{6}$'
),

    CONSTRAINT chk_parts_glow_color
        CHECK (
            glow_color IS NULL
            OR glow_color ~ '^#[0-9A-Fa-f]{6}$'
        )
);

CREATE TABLE saved_builds (
                              id UUID PRIMARY KEY,
                              name VARCHAR(100) NOT NULL,
                              status VARCHAR(20) NOT NULL DEFAULT 'draft',
                              created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT chk_saved_builds_name
                                  CHECK (length(trim(name)) > 0),

                              CONSTRAINT chk_saved_builds_status
                                  CHECK (status IN ('draft', 'complete'))
);

CREATE TABLE build_parts (
                             build_id UUID NOT NULL,
                             category_id VARCHAR(40) NOT NULL,
                             part_id VARCHAR(80) NOT NULL,

                             PRIMARY KEY (build_id, category_id),

                             CONSTRAINT fk_build_parts_build
                                 FOREIGN KEY (build_id)
                                     REFERENCES saved_builds(id)
                                     ON DELETE CASCADE,

                             CONSTRAINT fk_build_parts_part_category
                                 FOREIGN KEY (part_id, category_id)
                                     REFERENCES parts(id, category_id)
);