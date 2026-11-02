import { useState } from "react";
import Button from "react-bootstrap/Button";

export default function SavedBuildList({
                                           builds,
                                           onOpen,
                                           onDelete,
                                           onRefresh,
                                           error,
                                       }) {
    const [confirmingId, setConfirmingId] = useState(null);

    async function confirmDelete(id) {
        const deleted = await onDelete(id);

        if (deleted) {
            setConfirmingId(null);
        }
    }

    return (
        <section className="saved-designs">
            <div className="section-heading">
                <h2>Saved designs</h2>

                <Button variant="outline-light" onClick={onRefresh}>
                    Refresh list
                </Button>
            </div>

            <p>Open a design to continue building or change its notes.</p>

            {error && <p role="alert">{error}</p>}

            {!error && builds.length === 0 && (
                <p>No designs saved yet. Save one from Builder notes.</p>
            )}

            <ul className="saved-list">
                {builds.map((build) => (
                    <li className="saved-card" key={build.id}>
                        <h3>{build.name}</h3>
                        <p className="build-status">{build.status}</p>

                        <div className="saved-actions">
                            <Button
                                onClick={() => onOpen(build.id)}
                                aria-label={`Open ${build.name}`}
                            >
                                Open
                            </Button>

                            <Button
                                variant="outline-danger"
                                onClick={() => setConfirmingId(build.id)}
                                aria-label={`Delete ${build.name}`}
                            >
                                Delete
                            </Button>
                        </div>

                        {confirmingId === build.id && (
                            <div className="delete-confirmation">
                                <p>Delete “{build.name}” permanently?</p>

                                <Button
                                    variant="danger"
                                    aria-label={`Confirm delete ${build.name}`}
                                    onClick={() => confirmDelete(build.id)}
                                >
                                    Confirm delete
                                </Button>

                                <Button
                                    variant="outline-light"
                                    onClick={() => setConfirmingId(null)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}