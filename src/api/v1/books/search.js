import { FAKE_BOOK_GROUPS } from "../../../data/fakeBooksData";

export async function searchBooks(
    { page = 0, row_per_page = 40, title_prefix = [], title, author, sort_by, sort_order },
  ) {
  
    const typed = (title || "").trim().toLowerCase();
    const prefixes = (title_prefix || []).map((s) => String(s).toLowerCase());
  
    let filtered = Object.values(FAKE_BOOK_GROUPS).flat();
  
    if (typed.length > 0) {
      // prefix-match the full typed string against the book title
      filtered = filtered.filter((b) =>
        (b.title || "").toLowerCase().startsWith(typed)
      );
    } else if (prefixes.length > 0) {
      // shelf mode: match by first letter groups
      filtered = filtered.filter((b) =>
        prefixes.some((p) => (b.title || "").toLowerCase().startsWith(p))
      );
    } else {
      filtered = [];
    }
  
    const start = page * row_per_page;
    const end = start + row_per_page;
  
    return {
      books: filtered.slice(start, end),
      page,
      row_per_page,
      total_books: filtered.length,
      sort_by
    };
  }
  