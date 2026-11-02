// @vitest-environment jsdom

import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BuildForm from "../components/BuildForm.jsx";

afterEach(() => {
    cleanup();
});

test("submits the name and status", async () => {
    // Arrange
    const user = userEvent.setup();

    const onSave = vi.fn().mockResolvedValue({
        id: "saved-build-id",
    });

    render(<BuildForm onSave={onSave} />);

    // Act
    await user.type(
        screen.getByRole("textbox", { name: "Build name" }),
        "Desert Wanderer"
    );

    await user.click(
        screen.getByRole("radio", { name: "Complete" })
    );

    await user.click(
        screen.getByRole("button", { name: "Save build" })
    );

    // Assert
    const message = await screen.findByRole("status");

    expect(message.textContent).toContain("Build saved.");

    expect(onSave).toHaveBeenCalledTimes(1);

    expect(onSave).toHaveBeenCalledWith({
        name: "Desert Wanderer",
        status: "complete",
    });
});

test("rejects a blank name without submitting", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<BuildForm onSave={onSave} />);

    // Act
    await user.type(
        screen.getByRole("textbox", { name: "Build name" }),
        "   "
    );

    await user.click(
        screen.getByRole("button", { name: "Save build" })
    );

    // Assert
    const error = await screen.findByRole("alert");

    expect(error.textContent).toContain("Enter a build name.");
    expect(onSave).not.toHaveBeenCalled();
});

test("shows a save error and preserves the entered name", async () => {
    // Arrange
    const user = userEvent.setup();

    const onSave = vi.fn().mockRejectedValue(
        new Error("Network Error")
    );

    render(<BuildForm onSave={onSave} />);

    // Act
    await user.type(
        screen.getByRole("textbox", { name: "Build name" }),
        "Desert Wanderer"
    );

    await user.click(
        screen.getByRole("button", { name: "Save build" })
    );

    // Assert
    const error = await screen.findByRole("alert");

    expect(error.textContent).toContain(
        "Could not save build. Please try again."
    );

    expect(onSave).toHaveBeenCalledTimes(1);

    expect(
        screen.getByRole("textbox", { name: "Build name" }).value
    ).toBe("Desert Wanderer");

    expect(
        screen.getByRole("button", { name: "Save build" }).disabled
    ).toBe(false);
});