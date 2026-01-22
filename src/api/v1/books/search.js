import { FAKE_BOOKS } from "../../../data/fakeBooksData";

export async function searchBooks(
    { page = 0, row_per_page = 40, title_prefix = [], title } = {},
  ) {
    // Supports:
    //  - title: string (typed prefix)
    //  - title_prefix: ["A","B"] style (shelf grouping)
  
    const typed = (title || "").trim().toLowerCase();
    const prefixes = (title_prefix || []).map((s) => String(s).toLowerCase());
  
    let filtered = FAKE_BOOKS;
  
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
      total_books: filtered.length,
    };
  }
  