export default function BuildSummary({
                                         hilt,
                                         crystal,
                                         emitter,
                                         collar,
                                         switchPart,
                                         pommel,
                                     }) {
    const selections = [
        ["Hilt", hilt],
        ["Crystal", crystal],
        ["Emitter", emitter],
        ["Ring", collar],
        ["Switch", switchPart],
        ["Pommel", pommel],
    ];

    return (
        <section
            className="build-notebook"
            aria-labelledby="build-notebook-title"
        >
            <p className="eyebrow">WORKSHOP RECORD</p>
            <h2 id="build-notebook-title">Lightsaber Builder Notes</h2>

            <dl>
                {selections
                    .filter(([, part]) => part)
                    .map(([category, part]) => (
                        <div key={category}>
                            <dt>{category}</dt>
                            <dd>{part.name}</dd>
                        </div>
                    ))}
            </dl>
        </section>
    );
}