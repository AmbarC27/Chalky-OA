import "./LibraryPage.css";
import { useState } from "react";
import { useGroupedBooks } from "./hooks/useGroupedBooks";
import ShelfHouse from "./components/Shelfhouse";
import GridHouse from "./components/Gridhouse";

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
            placeholder="Write the name of the book"
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
