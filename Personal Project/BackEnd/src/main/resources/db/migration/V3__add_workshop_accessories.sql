INSERT INTO part_categories (id, name)
VALUES
    ('collar', 'Ring'),
    ('switch', 'Switch'),
    ('pommel', 'Pommel');

INSERT INTO parts (
    id, name, category_id, material_id, sort_order
)
VALUES
    ('collar-smooth', 'Smooth Ring', 'collar', 'steel', 1),
    ('collar-etched', 'Etched Ring', 'collar', 'brass', 2),
    ('collar-coil', 'Coil Ring', 'collar', 'alloy', 3),

    ('switch-stud', 'Stud Switch', 'switch', 'steel', 1),
    ('switch-rocker', 'Rocker Switch', 'switch', 'steel', 2),
    ('switch-toggle', 'Toggle Switch', 'switch', 'brass', 3),

    ('pommel-flat', 'Flat Pommel', 'pommel', 'steel', 1),
    ('pommel-vented', 'Vented Pommel', 'pommel', 'alloy', 2),
    ('pommel-crown', 'Crowned Pommel', 'pommel', 'brass', 3);

INSERT INTO build_parts (build_id, category_id, part_id)
SELECT b.id, defaults.category_id, defaults.part_id
FROM saved_builds b
         CROSS JOIN (
    VALUES
        ('collar', 'collar-smooth'),
        ('switch', 'switch-stud'),
        ('pommel', 'pommel-flat')
) AS defaults(category_id, part_id)
WHERE NOT EXISTS (
    SELECT 1
    FROM build_parts bp
    WHERE bp.build_id = b.id
      AND bp.category_id = defaults.category_id
);