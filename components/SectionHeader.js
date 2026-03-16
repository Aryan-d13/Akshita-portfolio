export default function SectionHeader({ question, title, note, titleStyle }) {
    return (
        <div className="section-header">
            <p className="question">{question}</p>
            <h2 className="section-title" style={titleStyle}>
                {title}
            </h2>
            {note && <p className="section-note">{note}</p>}
        </div>
    );
}
