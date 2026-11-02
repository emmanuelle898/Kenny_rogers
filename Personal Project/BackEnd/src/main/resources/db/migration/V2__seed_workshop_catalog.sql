INSERT INTO part_categories (id, name)
VALUES
    ('hilt', 'Hilt'),
    ('crystal', 'Crystal'),
    ('emitter', 'Emitter');

INSERT INTO materials (id, name)
VALUES
    ('alloy', 'Alloy'),
    ('brass', 'Brass'),
    ('steel', 'Steel'),
    ('wood', 'Wood'),
    ('gold', 'Gold');

INSERT INTO parts (
    id,
    name,
    category_id,
    material_id,
    background_color,
    sort_order
)
VALUES
    ('alloy', 'Ribbed Alloy', 'hilt', 'alloy', '#273c2b', 1),
    ('brass', 'Salvaged Brass', 'hilt', 'brass', '#c49e5b', 2),
    ('steel', 'Machined Steel', 'hilt', 'steel', '#b5c0c9', 3),
    ('wood', 'Wookie Wood', 'hilt', 'wood', '#6c4223', 4),
    ('gold', 'Golden Plated', 'hilt', 'gold', '#ffc30b', 5);

INSERT INTO parts (
    id,
    name,
    category_id,
    glow_color,
    sort_order
)
VALUES
    ('violet', 'Violet Crystal', 'crystal', '#ba00ff', 1),
    ('blue', 'Blue Crystal', 'crystal', '#0018f9', 2),
    ('yellow', 'Yellow crystal', 'crystal', '#ffe81f', 3),
    ('crimson', 'Crimson crystal', 'crystal', '#990000', 4),
    ('orange', 'Orange crystal', 'crystal', '#be5103', 5),
    ('green', 'Green crystal', 'crystal', '#33ff33', 6),
    ('white', 'White crystal', 'crystal', '#f4f8ff', 7),
    ('black', 'Black crystal', 'crystal', '#000000', 8);

INSERT INTO parts (
    id,
    name,
    category_id,
    sort_order
)
VALUES
    ('standard', 'Standard Emitter', 'emitter', 1),
    ('flared', 'Flared Emitter', 'emitter', 2),
    ('shrouded', 'Shrouded Emitter', 'emitter', 3);