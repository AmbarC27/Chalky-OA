import { useEffect, useState } from "react";
import { labelToPrefixes } from "../utils";
import { searchBooks } from "../../../api/booksApi";

export default function GridHouse({ label, searchPrefix }) {
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
                <img
                  className="BookSlot__img"
                  src={b.cover_image_url}
                  alt={b.title}
                />
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
