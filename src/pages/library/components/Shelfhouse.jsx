import Shelf from "./Shelf";
import { labelToPrefixes } from "../utils";

// helper: for label "C-D-E" take groups C/D/E, flatten, then take 4
export function booksForShelfLabel(label, groupedData) {
  if (!groupedData?.groups) return [];
  const prefixes = labelToPrefixes(label);
  const merged = prefixes.flatMap((p) => groupedData.groups[p] || []);
  return merged.slice(0, 4);
}


export const SHELVES = [
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

export default function ShelfHouse({
  onMoreBooks,
  groupedData,
  groupedLoading,
  groupedError,
}) {
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
