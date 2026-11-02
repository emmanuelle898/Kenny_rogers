package com.outerrim.workshop.builds;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class BuildController {

    private final BuildService buildService;

    public BuildController(BuildService buildService) {
        this.buildService = buildService;
    }

    @PostMapping(
            value = "/api/builds.sbr",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BuildResponse> createBuild(
            @Valid @RequestBody CreateBuildRequest request
    ) {
        return json(
                HttpStatus.CREATED,
                buildService.createBuild(request)
        );
    }

    @GetMapping(
            value = "/api/builds.sbr",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<BuildResponse>> listBuilds() {
        return json(
                HttpStatus.OK,
                buildService.listBuilds()
        );
    }

    @GetMapping(
            value = "/api/builds/{id}.sbr",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BuildDetailsResponse> getBuild(
            @PathVariable("id") UUID id
    ) {
        return json(
                HttpStatus.OK,
                buildService.getBuild(id)
        );
    }

    @PutMapping(
            value = "/api/builds/{id}.sbr",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BuildResponse> updateBuild(
            @PathVariable("id") UUID id,
            @Valid @RequestBody CreateBuildRequest request
    ) {
        return json(
                HttpStatus.OK,
                buildService.updateBuild(id, request)
        );
    }

    @DeleteMapping("/api/builds/{id}.sbr")
    public ResponseEntity<Void> deleteBuild(
            @PathVariable("id") UUID id
    ) {
        buildService.deleteBuild(id);

        return ResponseEntity.noContent()
                .header("X-Content-Type-Options", "nosniff")
                .build();
    }

    private <T> ResponseEntity<T> json(
            HttpStatus status,
            T body
    ) {
        return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-Content-Type-Options", "nosniff")
                .body(body);
    }
}