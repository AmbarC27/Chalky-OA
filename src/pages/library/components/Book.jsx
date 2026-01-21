export default function Book({ book }) {
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