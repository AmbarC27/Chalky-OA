import "./LibraryPage.css";
import { useEffect, useState } from "react";
import { useGroupedBooks } from "./hooks/useGroupedBooks";
import { labelToPrefixes } from "./utils";
import { searchBooks } from "../../api/booksApi";

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

// helper: for label "C-D-E" take groups C/D/E, flatten, then take 4
function booksForShelfLabel(label, groupedData) {
  if (!groupedData?.groups) return [];
  const prefixes = labelToPrefixes(label);
  const merged = prefixes.flatMap((p) => groupedData.groups[p] || []);
  return merged.slice(0, 4);
}

function Book({ book }) {
  return (
    <div className="BookSlot">
      <img
        className="BookSlot__img"
        src={book.cover_image_url}
        alt={book.title}
        draggable={false}
      />
    </div>
  );
}



function Shelf({ label, isFirst, onMoreBooks, books = [] }) {
  return (
    <section className="Shelf">
      <div className={`Shelf__plank ${isFirst ? "Shelf__plank--roof" : ""}`}>
        <span className="Shelf__label">{label}</span>
      </div>

      <div className="Shelf__interior">
        <div className="Shelf__slots">
        {books.map((b) => (
          <Book key={b.id} book={b} />
        ))}

          {/* pad to 4 if fewer */}
          {Array.from({ length: Math.max(0, 4 - books.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="BookSlot" />
          ))}

          <button
            type="button"
            className="Shelf__button"
            onClick={() => onMoreBooks(label)}
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

function ShelfHouse({ onMoreBooks, groupedData, groupedLoading, groupedError }) {
  if (groupedLoading) {
    return <div className="LibraryPage">Loading shelves…</div>;
  }

  if (groupedError) {
    return <div className="LibraryPage">Error: {groupedError}</div>;
  }

  return (
    <div className="Bookhouse">
      <div className="Bookhouse__walls">
        {SHELVES.map((s, i) => (
          <Shelf
            key={s.id}
            label={s.label}
            isFirst={i === 0}
            onMoreBooks={onMoreBooks}
            books={booksForShelfLabel(s.label, groupedData)}
          />
        ))}
      </div>

      <div className="Bookhouse__base" />
    </div>
  );
}

function GridHouse({ label, searchPrefix }) {
  // If searchPrefix exists, we're in search mode.
  // Otherwise, we're in shelf "More Books" mode.
  const titlePrefix = label ? labelToPrefixes(label) : [];
  const typedPrefix = (searchPrefix || "").trim();

  const [page, setPage] = useState(0);
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset when label/search changes
  useEffect(() => {
    setPage(0);
    setBooks([]);
    setTotalBooks(null);
    setError("");
  }, [label, typedPrefix]);

  useEffect(() => {
    // guard: need either label or typed prefix
    if (!typedPrefix && (!label || titlePrefix.length === 0)) return;

    const ac = new AbortController();
    setLoading(true);
    setError("");

    searchBooks(
      {
        page: 0,
        row_per_page: 40,
        // SEARCH MODE:
        title: typedPrefix ? typedPrefix : undefined,
        // SHELF MODE:
        title_prefix: typedPrefix ? undefined : titlePrefix,
        sort_by: "title",
        sort_order: "asc",
      },
      { signal: ac.signal }
    )
      .then((res) => {
        setBooks(res.books ?? []);
        setTotalBooks(res.total_books ?? null);
        setPage(res.page ?? 0);
      })
      .catch((e) => {
        if (ac.signal.aborted) return;
        setError(e.message || "Failed to load books");
      })
      .finally(() => {
        if (ac.signal.aborted) return;
        setLoading(false);
      });

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, typedPrefix]);

  const minSlots = 8;
  const placeholdersNeeded = Math.max(0, minSlots - books.length);

  const roofText = typedPrefix ? `Search: ${typedPrefix}` : label || "—";

  return (
    <div className="Bookhouse">
      <div className="Bookhouse__walls">
        <div className="Shelf__plank Shelf__plank--roof">
          <span className="Shelf__label">{roofText}</span>
        </div>

        <div className="Shelf__interior Shelf__interior--big">
          {error && <div className="ErrorText">{error}</div>}

          <div className="GridHouse__grid">
            {books.map((b) => (
              <div key={b.id} className="BookSlot">
                <img className="BookSlot__img" src={b.cover_image_url} alt={b.title} />
              </div>
            ))}

            {Array.from({ length: placeholdersNeeded }).map((_, idx) => (
              <div key={`ph-${idx}`} className="BookSlot" />
            ))}
          </div>
        </div>
      </div>

      <div className="Bookhouse__base" />
    </div>
  );
}


export default function LibraryPage() {
  const [view, setView] = useState("shelves");
  const [activeLabel, setActiveLabel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error } = useGroupedBooks({ group_size: 4 });

  const handleMoreBooks = (label) => {
    setActiveLabel(label);
    setView("grid");
  };

  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="LibraryPage">
      {/* Search bar */}
      {view !== "grid" && (
        <div className="LibrarySearch">
        <input
          className="LibrarySearch__input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title prefix… (e.g., A, Ab, C Book)"
        />
        {hasSearch && (
          <button
            type="button"
            className="LibrarySearch__clear"
            onClick={() => setSearchTerm("")}
          >
            Clear
          </button>
        )}
      </div>
      )}
      

      {/* When searching, show search results house */}
      {hasSearch ? (
        <GridHouse searchPrefix={searchTerm} />
      ) : view === "shelves" ? (
        <ShelfHouse
          onMoreBooks={handleMoreBooks}
          groupedData={data}
          groupedLoading={loading}
          groupedError={error}
        />
      ) : (
        <div className="GridHouseWrapper">
          <button
            type="button"
            className="BackButton"
            onClick={() => setView("shelves")}
            style={{ backgroundColor: "#2f5fb8", color: "white" }}
          >
            ← Back
          </button>

          <GridHouse label={activeLabel} />
        </div>
      )}
    </div>
  );
}
