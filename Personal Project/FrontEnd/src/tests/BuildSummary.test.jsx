// @vitest-environment jsdom

import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import BuildSummary from "../components/BuildSummary.jsx";

afterEach(() => {
    cleanup();
});

test("updates the notebook when selected parts change", () => {
    // Arrange: display the initial selections
    const { rerender } = render(
        <BuildSummary
            hilt={{ id: "alloy", name: "Ribbed Alloy" }}
            crystal={{ id: "violet", name: "Violet Crystal" }}
            emitter={{ id: "standard", name: "Standard Emitter" }}
        />
    );

    const notebook = within(
        screen.getByRole("region", { name: "Lightsaber Builder Notes" })
    );

    expect(notebook.getByText("Ribbed Alloy")).toBeTruthy();
    expect(notebook.getByText("Violet Crystal")).toBeTruthy();
    expect(notebook.getByText("Standard Emitter")).toBeTruthy();

    // Act: give the component different selections
    rerender(
        <BuildSummary
            hilt={{ id: "brass", name: "Salvaged Brass" }}
            crystal={{ id: "green", name: "Green Crystal" }}
            emitter={{ id: "flared", name: "Flared Emitter" }}
        />
    );

    // Assert: the new selections appear
    expect(notebook.getByText("Salvaged Brass")).toBeTruthy();
    expect(notebook.getByText("Green Crystal")).toBeTruthy();
    expect(notebook.getByText("Flared Emitter")).toBeTruthy();

    // The old selections are no longer displayed
    expect(notebook.queryByText("Ribbed Alloy")).toBeNull();
    expect(notebook.queryByText("Violet Crystal")).toBeNull();
    expect(notebook.queryByText("Standard Emitter")).toBeNull();
});