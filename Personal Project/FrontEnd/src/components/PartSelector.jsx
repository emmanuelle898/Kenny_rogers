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
                    <button
                        key={part.id}
                        type="button"
                        aria-pressed={selectedPart.id === part.id}
                        onClick={() => onSelect(part)}
                    >
                        {part.name}
                    </button>
                ))}
            </div>
        </fieldset>
    );
}