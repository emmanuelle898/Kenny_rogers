import { useState } from "react";
import { getWorkshopTheme } from "./utils/getWorkshopTheme.js";
import "./App.css";

const hilts = [
    { id: "alloy", name: "Ribbed alloy", backgroundColor: "#273c2b",backgroundImage: `
    linear-gradient(
      115deg,
      #00000066 0%,
      transparent 30%,
      #e1f2d51f 44%,
      transparent 58%,
      #00000055 100%
    ),
    repeating-linear-gradient(
      45deg,
      #142019 0px,
      #142019 3px,
      #455b48 4px,
      #8b9f86 6px,
      #61785d 9px,
      #354c38 17px,
      #25392a 22px,
      #101a13 25px,
      #101a13 13px
    )
  `,
    },

    { id: "brass", name: "Salvaged brass", backgroundColor: "#C49E5B", backgroundImage: `
    radial-gradient(
      ellipse at 12% 25%,
      #304c3ed9 0%,
      #43544188 9%,
      transparent 26%
    ),
    radial-gradient(
      ellipse at 85% 72%,
      #324e42cc 0%,
      #35433677 12%,
      transparent 30%
    ),
    radial-gradient(
      ellipse at 62% 18%,
      #643218bb 0%,
      #47291a66 10%,
      transparent 25%
    ),
    repeating-linear-gradient(
      3deg,
      #21130933 0px 1px,
      transparent 1px 5px,
      #f3db9e15 5px 6px,
      transparent 6px 11px
    ),
    linear-gradient(
      115deg,
      #382716 0%,
      #80602e 18%,
      #c4a363 34%,
      #99753b 44%,
      #4e371d 60%,
      #b89652 79%,
      #634721 100%
    )
  `,
    },

    {id: "steel", name: "Machined steel", backgroundColor: "#B5C0C9", backgroundImage: `
    repeating-linear-gradient(
      0deg,
      #ffffff12 0px,
      #ffffff12 1px,
      #00000012 1px,
      #00000012 2px,
      transparent 2px,
      transparent 4px),
    linear-gradient(
      115deg,
      #28323b 0%,
      #7e8c98 20%,
      #e6edf2 35%,
      #85939f 48%,
      #35434f 62%,
      #c1cbd3 80%,
      #53616c 100%
    )
  `,
    },

    { id: "wood", name: "Wookie wood", backgroundColor: "#6c4223", backgroundImage: `
    repeating-linear-gradient(
      92deg,
      transparent 0px,
      transparent 7px,
      #1c0e0866 8px,
      transparent 10px,
      #c08a4826 14px,
      transparent 18px,
      transparent 29px
    ),
    repeating-linear-gradient(
      88deg,
      transparent 0px,
      transparent 19px,
      #180c0755 21px,
      transparent 24px,
      transparent 47px
    ),
    linear-gradient(
      105deg,
      #25150e 0%,
      #57351f 25%,
      #805132 45%,
      #422719 65%,
      #6c4223 82%,
      #2b190f 100%
    )
  `,
    },

    { id: "gold", name: "Golden plated", backgroundColor: "#ffc30b", backgroundImage: `
    repeating-linear-gradient(
      0deg,
      #fff5bd0d 0px 1px,
      transparent 1px 4px
    ),
    linear-gradient(
      115deg,
      #493008 0%,
      #a87315 15%,
      #e8bb49 28%,
      #fff1ad 35%,
      #c99524 42%,
      #77500e 55%,
      #d9a62e 70%,
      #ffe99b 82%,
      #9c6913 94%,
      #533508 100%
    )
  `,
     }
];

const crystals = [
    { id: "violet", name: "Violet crystal", glowColor: "#ba00ff" },
    { id: "blue", name: "Blue crystal", glowColor: "#0018f9" },
    { id: "yellow", name: "Yellow crystal", glowColor: "#FFE81F" },
    { id: "crimson", name: "Crimson crystal", glowColor: "#990000" },
    { id: "orange", name: "Orange crystal", glowColor: "#be5103" },
    { id: "green", name: "Green crystal", glowColor: "#33ff33" },
    { id: "white", name: "White crystal", glowColor: "#f4f8ff" },
    { id: "black", name: "Black crystal", glowColor: "#000000" },

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
                "--workshop-texture": theme.backgroundImage,
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