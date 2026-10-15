import { beforeEach, expect, test, vi } from "vitest";
import axios from "axios";
import { getParts } from "../api/getParts.js";

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
    },
}));

beforeEach(() => {
    axios.get.mockReset();
});

test("requests available parts and returns the response data", async () => {
    // Arrange
    const parts = [
        { id: "alloy", name: "Ribbed alloy" },
        { id: "brass", name: "Salvage brass"},
        { id: "steel", name: "Machined steel"},
        { id: "wood", name: "Wookie wood"},
        { id: "gold", name: " Golden plated"}
    ];

    axios.get.mockResolvedValue({
        data: parts,
    });

    // Act
    const result = await getParts();

    // Assert
    expect(result).toEqual(parts);
    expect(axios.get).toHaveBeenCalledWith("/api/parts.sbr");
});

test("reports an unsuccessful server response", async () => {
    // Arrange
    axios.get.mockRejectedValue({
        response: {
            status: 500,
        },
    });

    // Act and Assert
    await expect(getParts()).rejects.toThrow(
        "Could not load parts (500)"
    );
});

