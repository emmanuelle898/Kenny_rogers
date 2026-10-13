export function getWorkshopTheme({hilt, crystal}) {
    return {
        backgroundColor: hilt.backgroundColor,
        glowColor: crystal.glowColor,
    };
}