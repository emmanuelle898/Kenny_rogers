export function getWorkshopAppearance({
                                          emitter,
                                          collar,
                                          switchPart,
                                          pommel,
                                      }) {
    const emitterShapes = {
        standard: {
            radius: "18px",
            crest: "polygon(0 25%, 100% 25%, 100% 75%, 0 75%)",
        },
        flared: {
            radius: "38px 8px 38px 8px",
            crest: "polygon(0 25%, 100% 0, 100% 100%, 0 75%)",
        },
        shrouded: {
            radius: "8px 30px 8px 30px",
            crest: "polygon(0 0, 100% 20%, 100% 80%, 0 100%)",
        },
    };

    const ringStyles = {
        "collar-smooth": ["solid", "12px", "none"],
        "collar-etched": [
            "double",
            "4px",
            "repeating-linear-gradient(45deg, #c9a86a18 0px 2px, transparent 2px 9px)",
        ],
        "collar-coil": [
            "solid",
            "999px",
            "repeating-linear-gradient(90deg, #c9a86a25 0px 2px, transparent 2px 8px)",
        ],
    };

    const switchStyles = {
        "switch-stud": ["system-ui, sans-serif", "999px"],
        "switch-rocker": ['"Trebuchet MS", Arial, sans-serif', "5px"],
        "switch-toggle": ['Georgia, "Times New Roman", serif', "3px 14px"],
    };

    const bases = {
        "pommel-flat": "solid",
        "pommel-vented": "dashed",
        "pommel-crown": "double",
    };

    const shape = emitterShapes[emitter?.id] ?? emitterShapes.standard;
    const ring = ringStyles[collar?.id] ?? ringStyles["collar-smooth"];
    const control = switchStyles[switchPart?.id] ?? switchStyles["switch-stud"];

    return {
        "--panel-radius": shape.radius,
        "--emitter-crest": shape.crest,
        "--nav-border": ring[0],
        "--nav-radius": ring[1],
        "--nav-texture": ring[2],
        "--workshop-font": control[0],
        "--control-radius": control[1],
        "--base-border": bases[pommel?.id] ?? "solid",
    };
}