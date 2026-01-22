import "./LibraryPage.css";
import { useState, useEffect } from "react";
import { groupBooks } from "../../api/v1/books/group";
import ShelfHouse from "./components/Shelfhouse";
import GridHouse from "./components/Gridhouse";

export default function LibraryPage() {
  const [view, setView] = useState("shelves");
  const [activeLabel, setActiveLabel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedData, setGroupedData] = useState(null);
  const [groupedLoading, setGroupedLoading] = useState(true);
  const [groupedError, setGroupedError] = useState("");

  useEffect(() => {
    setGroupedLoading(true);
    setGroupedError("");

    groupBooks({
      group_by: "title_first_letter",
      group_size: 5,
      page: 0,
      groups_per_page: 20,
    })
      .then(setGroupedData)
      .catch((e) => {
        setGroupedError(e.message || "Failed to load grouped books");
      })
      .finally(() => setGroupedLoading(false));
  }, []);

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
          groupedData={groupedData}
          groupedLoading={groupedLoading}
          groupedError={groupedError}
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
