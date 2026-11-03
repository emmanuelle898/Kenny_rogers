package com.outerrim.workshop.builds;

import com.outerrim.workshop.catalog.CatalogPart;
import com.outerrim.workshop.catalog.CatalogPartRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class BuildService {

    private final BuildRepository buildRepository;
    private final CatalogPartRepository catalogPartRepository;

    public BuildService(
            BuildRepository buildRepository,
            CatalogPartRepository catalogPartRepository
    ) {
        this.buildRepository = buildRepository;
        this.catalogPartRepository = catalogPartRepository;
    }

    @Transactional
    public BuildResponse createBuild(CreateBuildRequest request) {
        List<CatalogPart> selections = selectedParts(request);
        UUID id = UUID.randomUUID();
        String name = request.name().trim();

        buildRepository.save(id, name, request.status(), selections);

        return new BuildResponse(id, name, request.status());
    }

    @Transactional(readOnly = true)
    public List<BuildResponse> listBuilds() {
        return buildRepository.findAll();
    }

    @Transactional(
            readOnly = true,
            isolation = Isolation.REPEATABLE_READ
    )
    public BuildDetailsResponse getBuild(UUID id) {
        return buildRepository.findById(id)
                .orElseThrow(() -> notFound(id));
    }

    @Transactional
    public BuildResponse updateBuild(
            UUID id,
            CreateBuildRequest request
    ) {
        List<CatalogPart> selections = selectedParts(request);
        String name = request.name().trim();

        boolean updated = buildRepository.update(
                id,
                name,
                request.status(),
                selections
        );

        if (!updated) {
            throw notFound(id);
        }

        return new BuildResponse(id, name, request.status());
    }

    @Transactional
    public void deleteBuild(UUID id) {
        if (!buildRepository.deleteById(id)) {
            throw notFound(id);
        }
    }

    private List<CatalogPart> selectedParts(CreateBuildRequest request) {
        return List.of(
                requirePart(request.hiltId(), "hilt"),
                requirePart(request.crystalId(), "crystal"),
                requirePart(request.emitterId(), "emitter"),
                requirePart(
                        defaultId(request.collarId(), "collar-smooth"),
                        "collar"
                ),
                requirePart(
                        defaultId(request.switchId(), "switch-stud"),
                        "switch"
                ),
                requirePart(
                        defaultId(request.pommelId(), "pommel-flat"),
                        "pommel"
                )
        );
    }

    private String defaultId(String suppliedId, String fallback) {
        return suppliedId == null ? fallback : suppliedId;
    }

    private CatalogPart requirePart(String id, String category) {
        CatalogPart part = catalogPartRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Unknown part: " + id
                ));

        if (!category.equals(part.getCategoryId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Part " + id + " is not a " + category
            );
        }

        return part;
    }

    private ResponseStatusException notFound(UUID id) {
        return new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Build not found: " + id
        );
    }
}