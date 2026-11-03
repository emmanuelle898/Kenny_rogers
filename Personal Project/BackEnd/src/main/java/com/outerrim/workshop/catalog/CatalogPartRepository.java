package com.outerrim.workshop.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CatalogPartRepository
        extends JpaRepository<CatalogPart, String> {

    List<CatalogPart> findByCategoryIdOrderBySortOrderAscIdAsc(
            String categoryId
    );
}