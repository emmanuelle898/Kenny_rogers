
const STORAGE_KEY = "outer-rim-workshop.saved-build";

export function saveBuild(build) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(build));
}

export function loadSavedBuild() {
    try {
        const storedBuild = localStorage.getItem(STORAGE_KEY);
        if (!storedBuild) {
            return null;
        }
        const build = JSON.parse(storedBuild);
        if (
            build === null ||
            typeof build !== "object" ||
            Array.isArray(build)){
            return null;
        }
        return build;
    } catch {
        return null;
    }
}

export function clearSavedBuild() {
    localStorage.removeItem(STORAGE_KEY);
}