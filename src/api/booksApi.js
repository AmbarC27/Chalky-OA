import { FAKE_BOOK_GROUPS, FAKE_BOOKS } from "./fakeBooksData";

export async function groupBooks(
  { group_by = "title_first_letter", group_size = 4 } = {},
  { signal } = {}
) {
  // Return A–Z keys, but only A–E have data (rest empty)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const groups = {};

  letters.forEach((letter) => {
    const books = FAKE_BOOK_GROUPS[letter] || [];
    groups[letter] = books.slice(0, group_size);
  });

  return { groups };
}

export async function searchBooks(
  { page = 0, row_per_page = 40, title_prefix = [] } = {},
  { signal } = {}
) {
  const prefixes = (title_prefix || []).map(String);

  const filtered =
    prefixes.length === 0
      ? []
      : FAKE_BOOKS.filter((b) =>
          prefixes.some((p) => b.title.startsWith(p))
        );

  const start = page * row_per_page;
  const end = start + row_per_page;

  return {
    books: filtered.slice(start, end),
    page,
    total_books: filtered.length,
  };
}
