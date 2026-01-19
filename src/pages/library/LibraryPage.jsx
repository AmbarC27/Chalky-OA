import { useState } from "react";
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

function Shelf({ label, isFirst, onMoreBooks }) {
  return (
    <section className="Shelf">
      <div className={`Shelf__plank ${isFirst ? "Shelf__plank--roof" : ""}`}>
        <span className="Shelf__label">{label}</span>
      </div>

      <div className="Shelf__interior">
        <div className="Shelf__slots">
          <div className="BookSlot" />
          <div className="BookSlot" />
          <div className="BookSlot" />
          <div className="BookSlot" />

          <button
            type="button"
            className="Shelf__button"
            onClick={() => onMoreBooks(label)}   // 👈 pass label up
          >
            More
            <br />
            Books
          </button>
        </div>
      </div>
    </section>
  );
}

function ShelfHouse({ onMoreBooks }) {
  return (
    <div className="Bookhouse">
      <div className="Bookhouse__walls">
        {SHELVES.map((s, i) => (
          <Shelf
            key={s.id}
            label={s.label}
            isFirst={i === 0}
            onMoreBooks={onMoreBooks}
          />
        ))}
      </div>

      <div className="Bookhouse__base" />
    </div>
  );
}

function GridHouse({ label, totalBooks = 8 }) {
  const slots = Math.max(totalBooks, 8); // min 2 rows (4 per row)

  return (
    <div className="Bookhouse">
      <div className="Bookhouse__walls">
        {/* Roof plank with SAME label */}
        <div className="Shelf__plank Shelf__plank--roof">
          <span className="Shelf__label">{label}</span>
        </div>

        {/* One big interior */}
        <div className="Shelf__interior Shelf__interior--big">
          <div className="GridHouse__grid">
            {Array.from({ length: slots }).map((_, idx) => (
              <div key={idx} className="BookSlot" />
            ))}
          </div>
        </div>
      </div>

      <div className="Bookhouse__base" />
    </div>
  );
}

export default function LibraryPage() {
  const [view, setView] = useState("shelves"); // "shelves" | "grid"
  const [activeLabel, setActiveLabel] = useState(null);

  const handleMoreBooks = (label) => {
    setActiveLabel(label);
    setView("grid");
  };

  return (
    <div className="LibraryPage">
      {view === "shelves" ? (
        <ShelfHouse onMoreBooks={handleMoreBooks} />
      ) : (
        <div className="GridHouseWrapper">
          <button
            type="button"
            className="BackButton"
            onClick={() => setView("shelves")}
            style={{
              backgroundColor: "#2f5fb8",
              color: "white",
            }}
          >
            ← Back
          </button>

          <GridHouse label={activeLabel} totalBooks={8} />
        </div>
      )}
    </div>
  );
}
