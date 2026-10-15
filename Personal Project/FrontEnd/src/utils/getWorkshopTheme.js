export function getWorkshopTheme({hilt, crystal}) {
    return {
        backgroundColor: hilt.backgroundColor,
        backgroundImage : hilt.backgroundImage ?? "none",
        glowColor: crystal.glowColor,
    };
}