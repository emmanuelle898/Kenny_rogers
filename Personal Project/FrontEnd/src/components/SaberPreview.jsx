import "./SaberPreview.css";

export default function SaberPreview({
                                         hilt,
                                         crystal,
                                         emitter = { id: "standard", name: "Standard Emitter" },
                                         collar = { id: "collar-smooth" },
                                         switchPart = { id: "switch-stud" },
                                         pommel = { id: "pommel-flat" },
                                         ignited = true,
                                     }) {
    const halo =
        crystal.glowColor.toLowerCase() === "#000000"
            ? "#cbd5e1"
            : crystal.glowColor;

    return (
        <div
            className="saber-preview"
            role="img"
            aria-label={`Lightsaber with ${hilt.name}, ${crystal.name}, and ${emitter.name}`}
            style={{
                "--blade-color": crystal.glowColor,
                "--blade-halo": halo,
                "--hilt-color": hilt.backgroundColor,
                "--hilt-texture": hilt.backgroundImage ?? "none",
            }}
        >
            <div className="saber-preview__assembly" aria-hidden="true">
                <span
                    className={`saber-preview__pommel ${pommel.id}`}
                />

                <span className="saber-preview__grip">
                    <span
                        className={`saber-preview__switch ${switchPart.id}`}
                    />
                </span>

                <span
                    className={`saber-preview__collar ${collar.id}`}
                />

                <span
                    className={`saber-preview__emitter saber-preview__emitter--${emitter.id}`}
                />

                <span
                    className={`saber-preview__blade ${
                        ignited ? "" : "saber-preview__blade--off"
                    }`}
                />
            </div>
        </div>
    );
}