// @vitest-environment jsdom

import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import SaberPreview from "../components/SaberPreview.jsx";

afterEach(() => {
    cleanup();
});

test("updates the lightsaber preview when selected parts change", () => {
    // Arrange
    const alloy = {
        id: "alloy",
        name: "Ribbed Alloy",
        backgroundColor: "#273c2b",
        backgroundImage: "linear-gradient(#142019, #8b9f86)",
    };
    const brass = {
        id: "brass",
        name: "Salvaged Brass",
        backgroundColor: "#c49e5b",
        backgroundImage: "linear-gradient(#382716, #c4a363)",
    };
    const violet = {
        id: "violet",
        name: "Violet Crystal",
        glowColor: "#ba00ff",
    };
    const green = {
        id: "green",
        name: "Green Crystal",
        glowColor: "#33ff33",
    };
    const { rerender } = render(
        <SaberPreview hilt={alloy} crystal={violet} />
    );
    const initialPreview = screen.getByRole("img", {
        name: "Lightsaber with Ribbed Alloy, Violet Crystal, and Standard Emitter",
    });

    expect(
        initialPreview.style.getPropertyValue("--blade-color")
    ).toBe("#ba00ff");

    // Act: simulate the parent passing newly selected parts
    rerender(<SaberPreview hilt={brass} crystal={green} />);

    // Assert
    const updatedPreview = screen.getByRole("img", {
        name: "Lightsaber with Salvaged Brass, Green Crystal, and Standard Emitter",
    });

    expect(
        updatedPreview.style.getPropertyValue("--blade-color")
    ).toBe("#33ff33");

    expect(
        updatedPreview.style.getPropertyValue("--hilt-color")
    ).toBe("#c49e5b");

    expect(
        updatedPreview.style.getPropertyValue("--hilt-texture")
    ).toBe(brass.backgroundImage);
});