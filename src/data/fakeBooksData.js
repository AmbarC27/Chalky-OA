function coverUrl(seed) {
    // stable “random” image per seed
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/120/180`;
  }

function makeBook(id, title) {
    return {
      id,
      title,
      author: "Mock Author",
      description: "",
      cover_image_url: coverUrl(id),
      lexile_level: "500L",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  
export const FAKE_BOOK_GROUPS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, letter) => {
acc[letter] = Array.from({ length: 10 }).map((_, i) =>
    makeBook(`${letter}-${i}`, `${letter} ${i + 1}`)
);
return acc;
}, {});
  