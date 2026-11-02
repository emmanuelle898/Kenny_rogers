package com.outerrim.workshop.parts;

import com.outerrim.workshop.catalog.CatalogPart;
import com.outerrim.workshop.catalog.CatalogPartRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PartService {

    private final CatalogPartRepository catalogPartRepository;

    public PartService(CatalogPartRepository catalogPartRepository) {
        this.catalogPartRepository = catalogPartRepository;
    }

    public List<Part> getAllParts() {
        List<CatalogPart> storedHilts =
                catalogPartRepository
                        .findByCategoryIdOrderBySortOrderAscIdAsc("hilt");

        List<Part> response = new ArrayList<>();

        for (CatalogPart storedHilt : storedHilts) {
            response.add(new Part(
                    storedHilt.getId(),
                    storedHilt.getName(),
                    storedHilt.getBackgroundColor()
            ));
        }

        return response;
    }
}