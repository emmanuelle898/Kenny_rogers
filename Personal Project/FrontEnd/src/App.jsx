import { useState } from "react";
import { getWorkshopTheme } from "./util/getWorkshopTheme.js";
import "./App.css";

const hilts = [
    { id: "alloy", name: "Ribbed alloy", backgroundColor: "#273c2b" },
    { id: "brass", name: "Salvaged brass", backgroundColor: "#614326" },
    { id: "steel", name: "Machined steel", backgroundColor: "#334858" },
];

const crystals = [
    { id: "violet", name: "Violet crystal", glowColor: "#b77aff" },
    { id: "teal", name: "Teal crystal", glowColor: "#71ffd4" },
    { id: "amber", name: "Amber crystal", glowColor: "#ffc46b" },
];

export default function App() {
    const [selectedHilt, setSelectedHilt] = useState(hilts[0]);
    const [selectedCrystal, setSelectedCrystal] = useState(crystals[0]);

    const theme = getWorkshopTheme({
        hilt: selectedHilt,
        crystal: selectedCrystal,
    });

    return (
        <main
            className="workshop"
            style={{
                "--workshop-background": theme.backgroundColor,
                "--crystal-glow": theme.glowColor,
            }}
        >
            <header>
                <p className="eyebrow">INDEPENDENT SABER CRAFT</p>
                <h1>Outer Rim Workshop</h1>
                <p>Every component leaves its mark.</p>
            </header>

            <section className="workbench" aria-label="Current build">
                <h2>Your workbench</h2>

                <p aria-live="polite">
                    {selectedHilt.name} · {selectedCrystal.name}
                </p>

                <div className="crystal" aria-hidden="true" />
            </section>

            <fieldset className="component-drawer">
                <legend>Choose your hilt</legend>

                <div className="part-options">
                    {hilts.map((hilt) => (
                        <button
                            key={hilt.id}
                            type="button"
                            aria-pressed={selectedHilt.id === hilt.id}
                            onClick={() => setSelectedHilt(hilt)}
                        >
                            {hilt.name}
                        </button>
                    ))}
                </div>
            </fieldset>

            <fieldset className="component-drawer">
                <legend>Choose your crystal</legend>

                <div className="part-options">
                    {crystals.map((crystal) => (
                        <button
                            key={crystal.id}
                            type="button"
                            aria-pressed={selectedCrystal.id === crystal.id}
                            onClick={() => setSelectedCrystal(crystal)}
                        >
                            {crystal.name}
                        </button>
                    ))}
                </div>
            </fieldset>
        </main>
    );
}