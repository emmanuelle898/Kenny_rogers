package com.outerrim.workshop.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "parts")
public class CatalogPart {

    @Id
    @Column(length = 80)
    private String id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "category_id", nullable = false, length = 40)
    private String categoryId;

    @Column(name = "material_id", length = 40)
    private String materialId;

    @Column(name = "background_color", length = 7)
    private String backgroundColor;

    @Column(name = "glow_color", length = 7)
    private String glowColor;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected CatalogPart() {
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public String getMaterialId() {
        return materialId;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public String getGlowColor() {
        return glowColor;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}