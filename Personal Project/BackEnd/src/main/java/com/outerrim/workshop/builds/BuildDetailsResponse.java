package com.outerrim.workshop.builds;

import java.util.List;
import java.util.UUID;

public record BuildDetailsResponse(
        UUID id,
        String name,
        String status,
        List<BuildPartResponse> parts
) {
}