import { beforeEach, expect, test, vi } from "vitest";
import axios from "axios";

import {
    listBuilds,
    getBuild,
    updateBuild,
    deleteBuild,
} from "../api/builds.js";

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

beforeEach(() => {
    vi.resetAllMocks();
});

test("retrieves the saved-design list", async () => {
    const builds = [{ id: "example-id", name: "Test", status: "draft" }];
    axios.get.mockResolvedValue({ data: builds });

    expect(await listBuilds()).toEqual(builds);
    expect(axios.get).toHaveBeenCalledWith("/api/builds.sbr");
});

test("retrieves one saved design", async () => {
    const build = {
        id: "example-id",
        name: "Test",
        status: "draft",
        parts: [],
    };

    axios.get.mockResolvedValue({ data: build });

    expect(await getBuild("example-id")).toEqual(build);
    expect(axios.get).toHaveBeenCalledWith("/api/builds/example-id.sbr");
});

test("updates an existing design", async () => {
    const changes = { name: "Updated", status: "complete" };
    const response = { id: "example-id", ...changes };

    axios.put.mockResolvedValue({ data: response });

    expect(await updateBuild("example-id", changes)).toEqual(response);

    expect(axios.put).toHaveBeenCalledWith(
        "/api/builds/example-id.sbr",
        changes
    );
});

test("deletes the requested design", async () => {
    axios.delete.mockResolvedValue({ status: 204 });

    await deleteBuild("example-id");

    expect(axios.delete).toHaveBeenCalledWith(
        "/api/builds/example-id.sbr"
    );
});