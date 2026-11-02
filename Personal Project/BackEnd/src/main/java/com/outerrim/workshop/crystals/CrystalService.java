package com.outerrim.workshop.crystals;

import com.outerrim.workshop.catalog.CatalogPart;
import com.outerrim.workshop.catalog.CatalogPartRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CrystalService {

    private final CatalogPartRepository catalogPartRepository;

    public CrystalService(CatalogPartRepository catalogPartRepository) {
        this.catalogPartRepository = catalogPartRepository;
    }

    public List<Crystal> getAllCrystals() {
        List<CatalogPart> storedCrystals =
                catalogPartRepository
                        .findByCategoryIdOrderBySortOrderAscIdAsc("crystal");

        List<Crystal> response = new ArrayList<>();

        for (CatalogPart storedCrystal : storedCrystals) {
            response.add(new Crystal(
                    storedCrystal.getId(),
                    storedCrystal.getName(),
                    storedCrystal.getGlowColor()
            ));
        }

        return response;
    }
}