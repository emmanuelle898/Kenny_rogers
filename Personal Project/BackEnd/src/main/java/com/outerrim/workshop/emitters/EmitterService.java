package com.outerrim.workshop.emitters;

import com.outerrim.workshop.catalog.CatalogPart;
import com.outerrim.workshop.catalog.CatalogPartRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmitterService {

    private final CatalogPartRepository catalogPartRepository;

    public EmitterService(CatalogPartRepository catalogPartRepository) {
        this.catalogPartRepository = catalogPartRepository;
    }

    public List<Emitter> getAllEmitters() {
        List<CatalogPart> storedEmitters =
                catalogPartRepository
                        .findByCategoryIdOrderBySortOrderAscIdAsc("emitter");

        List<Emitter> response = new ArrayList<>();

        for (CatalogPart storedEmitter : storedEmitters) {
            response.add(new Emitter(
                    storedEmitter.getId(),
                    storedEmitter.getName()
            ));
        }

        return response;
    }
}