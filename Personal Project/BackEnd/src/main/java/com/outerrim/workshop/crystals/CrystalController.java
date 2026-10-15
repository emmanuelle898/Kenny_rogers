package com.outerrim.workshop.crystals;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
public class CrystalController {

    private final CrystalService crystalService;

    public CrystalController(CrystalService crystalService) {
        this.crystalService = crystalService;
    }

    @GetMapping(
            value = "/api/crystals.sbr",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public List<Crystal> getCrystal() {
        return crystalService.getAllCrystals();

    }
}

