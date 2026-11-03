import { beforeEach, expect, test, vi } from "vitest";
import axios from "axios";
import { getEmitters } from "../api/getEmitters.js";

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
    },
}));

beforeEach(() => {
    axios.get.mockReset();
});

test("gets the emitter catalog from the API", async () => {
    // Arrange
    const emitters = [
        { id: "standard", name: "Standard Emitter" },
        { id: "flared", name: "Flared Emitter" },
        { id: "shrouded", name: "Shrouded Emitter" },
    ];

    axios.get.mockResolvedValue({
        data: emitters,
    });

    // Act
    const result = await getEmitters();

    // Assert
    expect(axios.get).toHaveBeenCalledWith("/api/emitters.sbr");
    expect(result).toEqual(emitters);
});