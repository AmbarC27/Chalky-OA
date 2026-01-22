import { FAKE_BOOK_GROUPS } from "../../../data/fakeBooksData";

export async function groupBooks(
  { group_by = "title_first_letter", group_size = 4 } = {},
) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const groups = {};

  letters.forEach((letter) => {
    const books = FAKE_BOOK_GROUPS[letter] || [];
    groups[letter] = books.slice(0, group_size);
  });

  return { groups };
}