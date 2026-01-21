function coverUrl(seed) {
    // stable “random” image per seed
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/120/180`;
  }

function makeBook(id, title) {
    return {
      id,
      title,
      author: "Mock Author",
      cover_image_url: coverUrl(id),
      lexile_level: "500L",
    };
  }
  
  // Only first two shelves: A-B and C-D-E
  export const FAKE_BOOK_GROUPS = {
    A: Array.from({ length: 10 }).map((_, i) => makeBook(`A-${i}`, `A Book ${i + 1}`)),
    B: Array.from({ length: 10 }).map((_, i) => makeBook(`B-${i}`, `B Book ${i + 1}`)),
    C: Array.from({ length: 10 }).map((_, i) => makeBook(`C-${i}`, `C Book ${i + 1}`)),
    D: Array.from({ length: 10 }).map((_, i) => makeBook(`D-${i}`, `D Book ${i + 1}`)),
    E: Array.from({ length: 10 }).map((_, i) => makeBook(`E-${i}`, `E Book ${i + 1}`)),
  };
  
  // Convenience list for search
  export const FAKE_BOOKS = Object.values(FAKE_BOOK_GROUPS).flat();
  