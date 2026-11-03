import { beforeEach, expect, test, vi } from "vitest";
import axios from "axios";
import { createBuild } from "../api/createBuild.js";

vi.mock("axios", () => ({
    default: {
        post: vi.fn(),
    },
}));

beforeEach(() => {
    axios.post.mockReset();
});

test("sends a build to the backend and returns the saved result", async () => {
    // Arrange
    const build = {
        name: "Desert Wanderer",
        status: "draft",
        hiltId: "brass",
        crystalId: "green",
        emitterId: "flared",
    };

    const savedBuild = {
        id: "123e4567-e89b-42d3-a456-426614174000",
        name: "Desert Wanderer",
        status: "draft",
    };

    axios.post.mockResolvedValue({
        data: savedBuild,
    });

    // Act
    const result = await createBuild(build);

    // Assert
    expect(axios.post).toHaveBeenCalledWith(
        "/api/builds.sbr",
        build
    );

    expect(result).toEqual(savedBuild);
});

test("passes a failed save back to the caller", async () => {
    // Arrange
    const build = {
        name: "Desert Wanderer",
        status: "draft",
        hiltId: "brass",
        crystalId: "green",
        emitterId: "flared",
    };

    const error = new Error("Network Error");

    axios.post.mockRejectedValue(error);

    // Act and Assert
    await expect(createBuild(build)).rejects.toBe(error);
});