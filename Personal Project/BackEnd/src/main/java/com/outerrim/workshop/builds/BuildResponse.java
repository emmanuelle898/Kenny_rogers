package com.outerrim.workshop.builds;

import java.util.UUID;

public record BuildResponse(
        UUID id,
        String name,
        String status
) {
}