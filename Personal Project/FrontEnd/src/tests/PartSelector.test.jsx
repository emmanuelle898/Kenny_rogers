// @vitest-environment jsdom

import { useState } from "react";
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PartSelector from "../components/PartSelector.jsx";

afterEach(cleanup);

test("clicking a part changes which button is selected", async () => {
    // Arrange
    const user = userEvent.setup();

    const parts = [
        { id: "alloy", name: "Ribbed alloy" },
        { id: "brass", name: "Salvaged brass" },
    ];

    function TestPage() {
        const [selectedPart, setSelectedPart] = useState(parts[0]);

        return (
            <PartSelector
                title="Choose your hilt"
                parts={parts}
                selectedPart={selectedPart}
                onSelect={setSelectedPart}
            />
        );
    }

    render(<TestPage />);

    const alloyButton = screen.getByRole("button", {
        name: "Ribbed alloy",
    });

    const brassButton = screen.getByRole("button", {
        name: "Salvaged brass",
    });

    expect(alloyButton.getAttribute("aria-pressed")).toBe("true");

    // Act
    await user.click(brassButton);

    // Assert
    expect(brassButton.getAttribute("aria-pressed")).toBe("true");
    expect(alloyButton.getAttribute("aria-pressed")).toBe("false");
});