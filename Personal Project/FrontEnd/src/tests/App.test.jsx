// @vitest-environment jsdom

import { beforeEach, afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App.jsx";
import { getCrystals } from "../api/getCrystals.js";
import { getParts } from "../api/getParts.js";

vi.mock("../api/getParts.js", () => ({
    getParts: vi.fn(),
}));

vi.mock("../api/getCrystals.js", () => ({
    getCrystals: vi.fn(),
}));

beforeEach(() => {
    getParts.mockResolvedValue([
        {
            id: "alloy",
            name: "API alloy hilt",
            backgroundColor: "#273c2b",
        },
        {
            id: "brass",
            name: "API brass hilt",
            backgroundColor: "#987654",
        },
    ]);

    getCrystals.mockResolvedValue([
        {
            id: "violet",
            name: "Violet crystal",
            glowColor: "#ba00ff",
        },
    ]);
});

afterEach(() => {
    cleanup();
    vi.resetAllMocks();
});

test("selecting a crystal loaded from the API changes the glow", async () => {
    // Arrange
    const user = userEvent.setup();

    getCrystals.mockResolvedValue([
        {
            id: "test-violet",
            name: "Test violet crystal",
            glowColor: "#ba00ff",
        },
        {
            id: "test-cyan",
            name: "Test cyan crystal",
            glowColor: "#00ffff",
        },
    ]);

    // Act
    render(<App />);

    const cyanButton = await screen.findByRole("button", {
        name: "Test cyan crystal",
    });

    await user.click(cyanButton);

    // Assert
    expect(cyanButton.getAttribute("aria-pressed")).toBe("true");

    expect(
        screen.getByRole("main").style.getPropertyValue("--crystal-glow")
    ).toBe("#00ffff");
});

test("selecting a hilt loaded from the API changes the background", async () => {
    // Arrange
    const user = userEvent.setup();

    // Act
    render(<App />);

    const brassButton = await screen.findByRole("button", {
        name: "API brass hilt",
    });

    await user.click(brassButton);

    // Assert
    expect(brassButton.getAttribute("aria-pressed")).toBe("true");

    expect(
        screen.getByRole("main").style.getPropertyValue(
            "--workshop-background"
        )
    ).toBe("#987654");
});