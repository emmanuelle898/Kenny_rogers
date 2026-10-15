package com.outerrim.workshop.parts;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PartController {

    private final PartService partService;

    public PartController(PartService partService) {
        this.partService = partService;
    }

    @GetMapping(
            value = "/api/parts.sbr",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public List<Part> getParts() {
        return partService.getAllParts();

    }

}