import Button from "react-bootstrap/Button";

export default function PartSelector({
                                         title,
                                         parts,
                                         selectedPart,
                                         onSelect,
                                     }) {
    return (
        <fieldset className="component-drawer">
            <legend>{title}</legend>

            <div className="part-options">
                {parts.map((part) => (
                    <Button
                        key={part.id}
                        type="button"
                        variant="outline-light"
                        aria-pressed={selectedPart.id === part.id}
                        onClick={() => onSelect(part)}
                    >
                        {part.name}
                    </Button>
                ))}
            </div>
        </fieldset>
    );
}