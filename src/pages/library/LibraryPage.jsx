import "./LibraryPage.css";
import { useState } from "react";

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

          <button type="button" className="Shelf__button" onClick={onMoreBooks}>
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

function GridHouse({ totalBooks = 8 }) {
  // 4 books per row, minimum 2 rows => minimum 8 slots
  const slots = Math.max(totalBooks, 8);

  return (
    <div className="Bookhouse">
      <div className="Bookhouse__walls">
        {/* Roof plank (same style as your top floor divider) */}
        <div className="Shelf__plank Shelf__plank--roof" />

        {/* One huge interior (single “floor”) */}
        <div className="Shelf__interior Shelf__interior--big">
          <div className="GridHouse__grid">
            {Array.from({ length: slots }).map((_, idx) => (
              <div key={idx} className="BookSlot" />
            ))}
          </div>
        </div>
      </div>

      {/* Attached platform stays identical */}
      <div className="Bookhouse__base" />
    </div>
  );
}


export default function LibraryPage() {
  const [view, setView] = useState("shelves"); // "shelves" | "grid"

  return (
    <div className="LibraryPage">
      {view === "shelves" ? (
        <ShelfHouse onMoreBooks={() => setView("grid")} />
      ) : (
        <GridHouse totalBooks={8} />
      )}
    </div>
  );
}
