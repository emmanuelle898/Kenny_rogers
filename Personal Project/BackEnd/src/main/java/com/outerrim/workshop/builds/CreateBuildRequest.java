package com.outerrim.workshop.builds;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateBuildRequest(
        @NotBlank
        @Size(max = 100)
        String name,

        @NotBlank
        @Pattern(regexp = "draft|complete")
        String status,

        @NotBlank
        @Size(max = 80)
        String hiltId,

        @NotBlank
        @Size(max = 80)
        String crystalId,

        @NotBlank
        @Size(max = 80)
        String emitterId,

        @NotBlank
        @Size(max = 80)
        String collarId,

        @NotBlank
        @Size(max = 80)
        String switchId,

        @NotBlank
        @Size(max = 80)
        String pommelId
) {
}