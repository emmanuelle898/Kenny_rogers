// @vitest-environment jsdom

import  { beforeEach, afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App.jsx";
import { getParts } from "../api/getParts.js";
import { getCrystals } from "../api/getCrystals.js";
import { getEmitters } from "../api/getEmitters.js";
import { getAccessories } from "../api/getAccessories.js";

import {
    createBuild,
    listBuilds,
    getBuild,
    updateBuild,
    deleteBuild,
} from "../api/builds.js";

vi.mock("../api/getParts.js", () => ({ getParts: vi.fn() }));
vi.mock("../api/getCrystals.js", () => ({ getCrystals: vi.fn() }));
vi.mock("../api/getEmitters.js", () => ({ getEmitters: vi.fn() }));
vi.mock("../api/getAccessories.js", () => ({ getAccessories: vi.fn() }));

vi.mock("../api/builds.js", () => ({
    createBuild: vi.fn(),
    listBuilds: vi.fn(),
    getBuild: vi.fn(),
    updateBuild: vi.fn(),
    deleteBuild: vi.fn(),
}));

const savedId = "123e4567-e89b-42d3-a456-426614174000";

const hilts = [
    { id: "alloy", name: "Ribbed Alloy", backgroundColor: "#273c2b" },
    { id: "brass", name: "Salvaged Brass", backgroundColor: "#c49e5b" },
];

const crystals = [
    { id: "violet", name: "Violet Crystal", glowColor: "#ba00ff" },
    { id: "green", name: "Green Crystal", glowColor: "#33ff33" },
];

const emitters = [
    { id: "standard", name: "Standard Emitter" },
    { id: "flared", name: "Flared Emitter" },
    { id: "shrouded", name: "Shrouded Emitter" },
];

const accessories = [
    { id: "collar-smooth", name: "Smooth Ring", categoryId: "collar" },
    { id: "collar-etched", name: "Etched Ring", categoryId: "collar" },
    { id: "collar-coil", name: "Coil Ring", categoryId: "collar" },
    { id: "switch-stud", name: "Stud Switch", categoryId: "switch" },
    { id: "switch-rocker", name: "Rocker Switch", categoryId: "switch" },
    { id: "switch-toggle", name: "Toggle Switch", categoryId: "switch" },
    { id: "pommel-flat", name: "Flat Pommel", categoryId: "pommel" },
    { id: "pommel-vented", name: "Vented Pommel", categoryId: "pommel" },
    { id: "pommel-crown", name: "Crowned Pommel", categoryId: "pommel" },
];

const storedBuild = {
    id: savedId,
    name: "Stored saber",
    status: "draft",
    parts: [
        { ...hilts[1], categoryId: "hilt", materialName: "Brass" },
        { ...crystals[1], categoryId: "crystal" },
        { ...emitters[1], categoryId: "emitter" },
        accessories[1],
        accessories[5],
        accessories[8],
    ],
};

beforeEach(() => {
    getParts.mockResolvedValue(hilts);
    getCrystals.mockResolvedValue(crystals);
    getEmitters.mockResolvedValue(emitters);
    getAccessories.mockResolvedValue(accessories);

    listBuilds.mockResolvedValue([
        { id: savedId, name: "Stored saber", status: "draft" },
    ]);

    getBuild.mockResolvedValue(storedBuild);

    createBuild.mockResolvedValue({
        id: savedId,
        name: "Desert Wanderer",
        status: "draft",
    });

    updateBuild.mockResolvedValue({
        id: savedId,
        name: "Rebuilt saber",
        status: "draft",
    });

    deleteBuild.mockResolvedValue(undefined);
});

afterEach(() => {
    cleanup();
    vi.resetAllMocks();
});

async function openWorkshop() {
    render(<App />);

    await screen.findByRole("button", {
        name: "Salvaged Brass",
    });
}

test("part buttons change the saber and workshop appearance", async () => {
    const user = userEvent.setup();
    await openWorkshop();

    await user.click(screen.getByRole("button", { name: "Salvaged Brass" }));
    await user.click(screen.getByRole("button", { name: "Green Crystal" }));
    await user.click(screen.getByRole("button", { name: "Flared Emitter" }));
    await user.click(screen.getByRole("button", { name: "Etched Ring" }));
    await user.click(screen.getByRole("button", { name: "Toggle Switch" }));
    await user.click(screen.getByRole("button", { name: "Crowned Pommel" }));

    const style = screen.getByRole("main").style;

    expect(style.getPropertyValue("--workshop-background")).toBe("#c49e5b");
    expect(style.getPropertyValue("--crystal-glow")).toBe("#33ff33");
    expect(style.getPropertyValue("--panel-radius")).toBe("38px 8px 38px 8px");
    expect(style.getPropertyValue("--nav-border")).toBe("double");
    expect(style.getPropertyValue("--workshop-font")).toContain("Georgia");
    expect(style.getPropertyValue("--base-border")).toBe("double");

    const preview = screen.getByRole("img");

    expect(
        preview.querySelector(".saber-preview__emitter--flared")
    ).not.toBeNull();

    expect(preview.closest(".preview-dock")).not.toBeNull();
});

test("creates a design with all five selections", async () => {
    const user = userEvent.setup();
    await openWorkshop();

    await user.click(screen.getByRole("button", { name: "Salvaged Brass" }));
    await user.click(screen.getByRole("button", { name: "Green Crystal" }));

    await user.click(screen.getByRole("button", { name: "Builder notes" }));

    await user.type(
        screen.getByRole("textbox", { name: "Build name" }),
        "Desert Wanderer"
    );

    await user.click(screen.getByRole("button", { name: "Save build" }));

    await screen.findByRole("button", { name: "Update build" });

    expect(createBuild).toHaveBeenCalledWith({
        name: "Desert Wanderer",
        status: "draft",
        hiltId: "brass",
        crystalId: "green",
        emitterId: "standard",
        collarId: "collar-smooth",
        switchId: "switch-stud",
        pommelId: "pommel-flat",
    });

    expect(screen.getByRole("img")).not.toBeNull();
});

test("opens a saved design and updates the same record", async () => {
    const user = userEvent.setup();
    await openWorkshop();

    await user.click(screen.getByRole("button", { name: "Saved designs" }));
    await user.click(screen.getByRole("button", { name: "Open Stored saber" }));

    const nameInput = await screen.findByDisplayValue("Stored saber");

    expect(
        screen.getByRole("main").style.getPropertyValue("--workshop-background")
    ).toBe("#c49e5b");

    await user.clear(nameInput);
    await user.type(nameInput, "Rebuilt saber");

    await user.click(screen.getByRole("button", { name: "Update build" }));

    await waitFor(() => {
        expect(updateBuild).toHaveBeenCalledWith(savedId, {
            name: "Rebuilt saber",
            status: "draft",
            hiltId: "brass",
            crystalId: "green",
            emitterId: "flared",
            collarId: "collar-etched",
            switchId: "switch-toggle",
            pommelId: "pommel-crown",
        });
    });

    expect(createBuild).not.toHaveBeenCalled();
});

test("requires confirmation before deleting a saved design", async () => {
    const user = userEvent.setup();
    await openWorkshop();

    await user.click(screen.getByRole("button", { name: "Saved designs" }));
    await user.click(screen.getByRole("button", { name: "Delete Stored saber" }));

    expect(deleteBuild).not.toHaveBeenCalled();

    await user.click(
        screen.getByRole("button", { name: "Confirm delete Stored saber" })
    );

    await waitFor(() => {
        expect(
            screen.queryByRole("button", { name: "Open Stored saber" })
        ).toBeNull();
    });

    expect(deleteBuild).toHaveBeenCalledWith(savedId);
});

test("New build clears the editor without deleting saved designs", async () => {
    const user = userEvent.setup();
    await openWorkshop();

    await user.click(screen.getByRole("button", { name: "Saved designs" }));
    await user.click(screen.getByRole("button", { name: "Open Stored saber" }));

    await screen.findByDisplayValue("Stored saber");

    await user.click(screen.getByRole("button", { name: "New build" }));
    await user.click(screen.getByRole("button", { name: "Builder notes" }));

    expect(
        screen.getByRole("textbox", { name: "Build name" }).value
    ).toBe("");

    expect(screen.getByRole("button", { name: "Save build" })).not.toBeNull();

    expect(deleteBuild).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Saved designs" }));

    expect(
        screen.getByRole("button", { name: "Open Stored saber" })
    ).not.toBeNull();
});

test("renders a saved name as text instead of an HTML element", async () => {
    const hostileName = "<img src=x onerror=alert(1)>";

    listBuilds.mockResolvedValue([
        { id: savedId, name: hostileName, status: "draft" },
    ]);

    const user = userEvent.setup();
    await openWorkshop();

    await user.click(screen.getByRole("button", { name: "Saved designs" }));

    const heading = screen.getByRole("heading", { name: hostileName });

    expect(heading.textContent).toBe(hostileName);
    expect(heading.querySelector("img")).toBeNull();
});