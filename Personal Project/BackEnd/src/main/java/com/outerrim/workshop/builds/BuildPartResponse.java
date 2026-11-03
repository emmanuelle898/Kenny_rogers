package com.outerrim.workshop.builds;

public record BuildPartResponse(
        String id,
        String name,
        String categoryId,
        String materialName,
        String backgroundColor,
        String glowColor
) {
}