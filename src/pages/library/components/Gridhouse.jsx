import { useEffect, useState } from "react";
import { labelToPrefixes } from "../utils";
import { searchBooks } from "../../../api/v1/books/search";

export default function GridHouse({ label, searchPrefix }) {
  // If searchPrefix exists, we're in search mode.
  // Otherwise, we're in shelf  mode.
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

  // Fetch page 0 when label/search changes
  useEffect(() => {
    // guard: need either label or typed prefix
    if (!typedPrefix && (!label || titlePrefix.length === 0)) return;

    setLoading(true);
    setError("");

    searchBooks({
      page: 0,
      row_per_page: 40,
      // SEARCH MODE:
      title: typedPrefix ? typedPrefix : undefined,
      // SHELF MODE:
      title_prefix: typedPrefix ? undefined : titlePrefix,
      author: undefined,
      sort_by: "title",
      sort_order: "asc",
    })
      .then((res) => {
        setBooks(res.books ?? []);
        setTotalBooks(res.total_books ?? null);
        setPage(res.page ?? 0);
      })
      .catch((e) => {
        setError(e.message || "Failed to load books");
      })
      .finally(() => {
        setLoading(false);
      });
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
