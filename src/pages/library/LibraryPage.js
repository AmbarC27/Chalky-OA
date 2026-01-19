import "./LibraryPage.css";

const SHELVES = [
    { id: "s1", label: "A-B" },
    { id: "s2", label: "C-D-E" },
    { id: "s3", label: "F-G-H" },
    { id: "s4", label: "I-J-K" },
    { id: "s5", label: "L-M-N" },
    { id: "s6", label: "O-P-Q" },
    { id: "s7", label: "R-S-T" },
    { id: "s8", label: "U-V-W" },
    { id: "s9", label: "X-Y-Z" },
  ];

function Shelf({ label, isFirst }) {
  return (
    <section className="Shelf">
      {/* Full-width divider (also roof for first shelf) */}
      <div className={`Shelf__plank ${isFirst ? "Shelf__plank--roof" : ""}`}>
        <span className="Shelf__label">{label}</span>
      </div>

      {/* Inset interior */}
      <div className="Shelf__interior">
        <div className="Shelf__books">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="BookSlot" />
          ))}
        </div>

        <button type="button" className="Shelf__button">
          See more
          <br />
          Books
        </button>
      </div>
    </section>
  );
}

export default function LibraryPage() {
  return (
    <div className="LibraryPage">
      <div className="Bookhouse">
        {/* Side walls (inset) */}
        <div className="Bookhouse__walls">
          {SHELVES.map((s, i) => (
            <Shelf key={s.id} label={s.label} isFirst={i === 0} />
          ))}
        </div>

        {/* Bottom platform */}
        <div className="Bookhouse__base" />
      </div>
    </div>
  );
}
