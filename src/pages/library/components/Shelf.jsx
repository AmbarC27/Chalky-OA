import Book from "./Book";

export default function Shelf({ label, isFirst, onMoreBooks, books = [] }) {
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
