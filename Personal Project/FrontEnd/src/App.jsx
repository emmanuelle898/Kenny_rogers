import { useEffect, useState } from "react";

import { getParts } from "./api/getParts.js";
import { getCrystals } from "./api/getCrystals.js";
import { getEmitters } from "./api/getEmitters.js";
import { getAccessories } from "./api/getAccessories.js";

import {
    createBuild,
    listBuilds,
    getBuild,
    updateBuild,
    deleteBuild,
} from "./api/builds.js";

import PartSelector from "./components/PartSelector.jsx";
import SaberPreview from "./components/SaberPreview.jsx";
import BuildSummary from "./components/BuildSummary.jsx";
import BuildForm from "./components/BuildForm.jsx";
import SavedBuildList from "./components/SavedBuildList.jsx";

import { getWorkshopTheme } from "./utils/getWorkshopTheme.js";
import { getWorkshopAppearance } from "./utils/getWorkshopAppearance.js";
import { hiltStyles } from "./styles/hiltStyles.js";
import "./App.css";
import "./styles/workshopSurfaces.css";

const categories = ["hilt", "crystal", "emitter", "collar", "switch", "pommel"];

const drawerTitles = {
    hilt: "Choose your hilt",
    crystal: "Choose your crystal",
    emitter: "Choose your emitter",
    collar: "Choose your ring",
    switch: "Choose your switch",
    pommel: "Choose your pommel",
};

function defaultSelections(catalog) {
    return Object.fromEntries(
        categories.map((category) => [category, catalog[category][0]])
    );
}

function restoreSelections(build, catalog) {
    return Object.fromEntries(
        categories.map((category) => {
            const savedPart = build.parts.find(
                (part) => part.categoryId === category
            );

            const availablePart = catalog[category].find(
                (part) => part.id === savedPart?.id
            );

            if (!availablePart) {
                throw new Error(
                    `The saved ${category} is not available in the catalog.`
                );
            }

            return [category, availablePart];
        })
    );
}

export default function App() {
    const [catalog, setCatalog] = useState(null);
    const [selected, setSelected] = useState(null);
    const [loadingError, setLoadingError] = useState("");

    const [tab, setTab] = useState("parts");
    const [ignited, setIgnited] = useState(true);
    const [busy, setBusy] = useState(false);

    const [builds, setBuilds] = useState([]);
    const [listError, setListError] = useState("");
    const [currentBuildId, setCurrentBuildId] = useState(null);

    const [formVersion, setFormVersion] = useState(0);
    const [formInitial, setFormInitial] = useState({
        name: "",
        status: "draft",
    });

    const [notice, setNotice] = useState("");
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadWorkshop() {
            try {
                const [
                    hilts,
                    crystals,
                    emitters,
                    accessories,
                    savedDesigns,
                ] = await Promise.all([
                    getParts(),
                    getCrystals(),
                    getEmitters(),
                    getAccessories(),
                    listBuilds().catch(() => null),
                ]);

                const loadedCatalog = {
                    hilt: hilts.map((hilt) => ({
                        ...hilt,
                        backgroundImage: hiltStyles[hilt.id] ?? "none",
                    })),
                    crystal: crystals,
                    emitter: emitters,
                    collar: accessories.filter(
                        (part) => part.categoryId === "collar"
                    ),
                    switch: accessories.filter(
                        (part) => part.categoryId === "switch"
                    ),
                    pommel: accessories.filter(
                        (part) => part.categoryId === "pommel"
                    ),
                };

                for (const category of categories) {
                    if (loadedCatalog[category].length === 0) {
                        throw new Error(`No ${category} parts are available.`);
                    }
                }

                if (!active) return;

                setCatalog(loadedCatalog);
                setSelected(defaultSelections(loadedCatalog));
                setBuilds(savedDesigns ?? []);

                if (savedDesigns === null) {
                    setListError(
                        "Could not load saved designs. Use Refresh list to retry."
                    );
                }
            } catch (error) {
                if (active) {
                    setLoadingError(
                        `Could not load the workshop: ${error.message}`
                    );
                }
            }
        }

        loadWorkshop();

        return () => {
            active = false;
        };
    }, []);

    function changePart(category, part) {
        setSelected((current) => ({
            ...current,
            [category]: part,
        }));

        setNotice("");
        setActionError("");
    }

    function resetEditor() {
        setSelected(defaultSelections(catalog));
        setCurrentBuildId(null);
        setFormInitial({ name: "", status: "draft" });
        setFormVersion((version) => version + 1);
        setIgnited(true);
    }

    function startNewBuild() {
        resetEditor();
        setTab("parts");
        setActionError("");
        setNotice("Fresh workbench ready. Saved designs are unchanged.");
    }

    async function handleSave(formData) {
        setBusy(true);
        setActionError("");
        setNotice("");

        const payload = {
            name: formData.name,
            status: formData.status,
            hiltId: selected.hilt.id,
            crystalId: selected.crystal.id,
            emitterId: formData.emitterId,
            collarId: selected.collar.id,
            switchId: selected.switch.id,
            pommelId: selected.pommel.id,
        };

        try {
            const saved = currentBuildId
                ? await updateBuild(currentBuildId, payload)
                : await createBuild(payload);

            setCurrentBuildId(saved.id);

            setBuilds((current) => [
                saved,
                ...current.filter((build) => build.id !== saved.id),
            ]);

            return saved;
        } finally {
            setBusy(false);
        }
    }

    async function openSavedBuild(id) {
        setBusy(true);
        setActionError("");
        setNotice("");

        try {
            const build = await getBuild(id);
            const restored = restoreSelections(build, catalog);

            setSelected(restored);
            setCurrentBuildId(build.id);
            setFormInitial({
                name: build.name,
                status: build.status,
            });

            setFormVersion((version) => version + 1);
            setTab("notes");
            setNotice("Design opened. Changes are saved with Update build.");
        } catch (error) {
            setActionError(`Could not open the design. ${error.message}`);
        } finally {
            setBusy(false);
        }
    }

    async function removeSavedBuild(id) {
        setBusy(true);
        setActionError("");
        setNotice("");

        try {
            await deleteBuild(id);

            setBuilds((current) =>
                current.filter((build) => build.id !== id)
            );

            if (currentBuildId === id) {
                resetEditor();
            }

            setNotice("Design deleted.");
            return true;
        } catch {
            setActionError("Could not delete the design. Please try again.");
            return false;
        } finally {
            setBusy(false);
        }
    }

    async function refreshSavedBuilds() {
        setBusy(true);

        try {
            setBuilds(await listBuilds());
            setListError("");
        } catch {
            setListError("Could not load saved designs. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    if (loadingError) {
        return (
            <main className="startup">
                <h1>Outer Rim Workshop</h1>
                <p role="alert">{loadingError}</p>
                <p>Check that the backend is running, then refresh.</p>
            </main>
        );
    }

    if (!selected) {
        return (
            <main className="startup">
                <p role="status">Opening the workshop...</p>
            </main>
        );
    }

    const theme = getWorkshopTheme({
        hilt: selected.hilt,
        crystal: selected.crystal,
    });

    const appearance = getWorkshopAppearance({
        emitter: selected.emitter,
        collar: selected.collar,
        switchPart: selected.switch,
        pommel: selected.pommel,
    });

    const accent =
        theme.glowColor.toLowerCase() === "#000000"
            ? "#cbd5e1"
            : theme.glowColor;

    return (
        <main
            className="workshop"
            style={{
                "--workshop-background": theme.backgroundColor,
                "--workshop-texture": theme.backgroundImage,
                "--crystal-glow": theme.glowColor,
                "--accent": accent,
                ...appearance,
            }}
        >
            <header className="workshop-header">
                <div>
                    <p className="eyebrow">INDEPENDENT SABER CRAFT</p>
                    <h1>Outer Rim Workshop</h1>
                </div>

            </header>

            <div className="workshop-layout">
                <section
                    className="preview-dock"
                    aria-label="Current build"
                >
                    <div className="bench-heading">
                        <p className="eyebrow">ASSEMBLY BENCH</p>
                        <h2>{currentBuildId ? "Your saved design" : "A new beginning"}</h2>
                        <p className="bench-description">
                            Every component leaves its mark.
                        </p>
                    </div>

                    <SaberPreview
                        hilt={selected.hilt}
                        crystal={selected.crystal}
                        emitter={selected.emitter}
                        collar={selected.collar}
                        switchPart={selected.switch}
                        pommel={selected.pommel}
                        ignited={ignited}
                    />

                    <div className="bench-footer">
                        <p aria-live="polite">
                            {selected.hilt.name} · {selected.crystal.name}
                        </p>
                        <button
                            type="button"
                            className="workshop-button"
                            onClick={startNewBuild}
                            disabled={busy}
                        >
                            New build
                        </button>

                        <button
                            type="button"
                            className="workshop-button"
                            aria-pressed={ignited}
                            onClick={() => setIgnited((value) => !value)}
                        >
                            {ignited ? "Extinguish blade" : "Ignite blade"}
                        </button>
                    </div>
                </section>

                <div className="control-deck" aria-busy={busy}>
                    <nav
                        className="workshop-nav"
                        aria-label="Workshop sections"
                    >
                        {[
                            ["parts", "Parts"],
                            ["notes", "Builder notes"],
                            ["saved", "Saved designs"],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={tab === value}
                                disabled={busy}
                                onClick={() => setTab(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>

                    <div className="workshop-feedback">
                        {notice && <p role="status">{notice}</p>}
                        {actionError && <p role="alert">{actionError}</p>}
                    </div>

                    <fieldset
                        className="deck-scroll"
                        disabled={busy}
                    >
                        <legend className="visually-hidden">
                            Workshop controls
                        </legend>

                        <section hidden={tab !== "parts"}>
                            <div className="section-heading">
                                <div>
                                    <p className="eyebrow">COMPONENT DRAWERS</p>
                                    <h2>Make it yours</h2>
                                </div>
                            </div>

                            {categories.map((category) => (
                                <PartSelector
                                    key={category}
                                    title={drawerTitles[category]}
                                    parts={catalog[category]}
                                    selectedPart={selected[category]}
                                    onSelect={(part) =>
                                        changePart(category, part)
                                    }
                                />
                            ))}
                        </section>

                        <section hidden={tab !== "notes"}>
                            <BuildSummary
                                hilt={selected.hilt}
                                crystal={selected.crystal}
                                emitter={selected.emitter}
                                collar={selected.collar}
                                switchPart={selected.switch}
                                pommel={selected.pommel}
                            />

                            <BuildForm
                                key={formVersion}
                                emitters={catalog.emitter}
                                // selectedEmitter={selected.emitter}
                                // onEmitterChange={(part) =>
                                //     changePart("emitter", part)
                                // }
                                onSave={handleSave}
                                initialName={formInitial.name}
                                initialStatus={formInitial.status}
                                submitLabel={
                                    currentBuildId
                                        ? "Update build"
                                        : "Save build"
                                }
                            />
                        </section>

                        <section hidden={tab !== "saved"}>
                            <SavedBuildList
                                builds={builds}
                                error={listError}
                                onOpen={openSavedBuild}
                                onDelete={removeSavedBuild}
                                onRefresh={refreshSavedBuilds}
                            />
                        </section>
                    </fieldset>
                </div>
            </div>
        </main>
    );
}