import { useId, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function BuildForm({
                                      emitters,
                                      selectedEmitter,
                                      onEmitterChange,
                                      onSave,
                                      initialName = "",
                                      initialStatus = "draft",
                                      submitLabel = "Save build",
                                  }) {
    const formId = useId();

    const [name, setName] = useState(initialName);
    const [status, setStatus] = useState(initialStatus);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    function clearFeedback() {
        setError("");
        setMessage("");
    }

    function handleEmitterChange(event) {
        const emitter = emitters.find(
            (part) => part.id === event.target.value
        );

        if (emitter) {
            onEmitterChange(emitter);
            clearFeedback();
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (saving) {
            return;
        }

        clearFeedback();

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("Enter a build name.");
            return;
        }

        if (trimmedName.length > 100) {
            setError("Build names must be 100 characters or fewer.");
            return;
        }

        const emitterExists = emitters.some(
            (emitter) => emitter.id === selectedEmitter?.id
        );

        if (!emitterExists) {
            setError("Choose an available emitter.");
            return;
        }

        setSaving(true);

        try {
            await onSave({
                name: trimmedName,
                status,
                emitterId: selectedEmitter.id,
            });

            setMessage("Build saved.");
        } catch {
            setError("Could not save build. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section
            className="build-form"
            aria-labelledby={`${formId}-title`}
        >
            <h2 id={`${formId}-title`}>Save your design</h2>

            <Form noValidate onSubmit={handleSubmit}>
                <fieldset disabled={saving}>
                    <legend className="visually-hidden">
                        Build details
                    </legend>

                    <Form.Group
                        className="mb-3"
                        controlId={`${formId}-name`}
                    >
                        <Form.Label>Build name</Form.Label>

                        <Form.Control
                            type="text"
                            name="buildName"
                            value={name}
                            maxLength={100}
                            required
                            onChange={(event) => {
                                setName(event.target.value);
                                clearFeedback();
                            }}
                        />
                    </Form.Group>

                    <fieldset className="mb-3">
                        <legend className="fs-6">Build status</legend>

                        <Form.Check
                            type="radio"
                            id={`${formId}-draft`}
                            name={`${formId}-status`}
                            label="Draft"
                            value="draft"
                            checked={status === "draft"}
                            onChange={(event) => {
                                setStatus(event.target.value);
                                clearFeedback();
                            }}
                        />

                        <Form.Check
                            type="radio"
                            id={`${formId}-complete`}
                            name={`${formId}-status`}
                            label="Complete"
                            value="complete"
                            checked={status === "complete"}
                            onChange={(event) => {
                                setStatus(event.target.value);
                                clearFeedback();
                            }}
                        />
                    </fieldset>



                    <Button type="submit" variant="primary">
                        {saving ? "Saving..." : submitLabel}
                    </Button>
                </fieldset>

                {error && (
                    <p role="alert" className="mt-3">
                        {error}
                    </p>
                )}

                {message && (
                    <p role="status" className="mt-3">
                        {message}
                    </p>
                )}
            </Form>
        </section>
    );
}