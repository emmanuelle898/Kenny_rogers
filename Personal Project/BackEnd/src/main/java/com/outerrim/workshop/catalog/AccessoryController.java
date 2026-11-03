package com.outerrim.workshop.catalog;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AccessoryController {

    private final CatalogPartRepository repository;

    public AccessoryController(CatalogPartRepository repository) {
        this.repository = repository;
    }

    @GetMapping(
            value = "/api/accessories.sbr",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public List<AccessoryResponse> getAccessories() {
        List<AccessoryResponse> response = new ArrayList<>();

        for (String category : List.of("collar", "switch", "pommel")) {
            for (CatalogPart part :
                    repository.findByCategoryIdOrderBySortOrderAscIdAsc(category)) {

                response.add(new AccessoryResponse(
                        part.getId(),
                        part.getName(),
                        part.getCategoryId()
                ));
            }
        }

        return response;
    }

    public record AccessoryResponse(
            String id,
            String name,
            String categoryId
    ) {
    }
}