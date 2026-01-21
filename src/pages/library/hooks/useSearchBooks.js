import { useCallback, useEffect, useMemo, useState } from "react";
import { searchBooks } from "../../../api/booksApi";

export function useSearchBooks({ title_prefix, row_per_page = 40 } = {}) {
  const [page, setPage] = useState(0);
  const [books, setBooks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Stable key for dependencies (avoid repeating JSON.stringify everywhere)
  const prefixKey = useMemo(
    () => JSON.stringify(title_prefix || []),
    [title_prefix]
  );

  // Reset when prefixes change
  useEffect(() => {
    setPage(0);
    setBooks([]);
    setMeta(null);
    setError("");
  }, [prefixKey]);

  const fetchPage = useCallback(
    async (nextPage, { append } = { append: false }) => {
      const ac = new AbortController();
      setLoading(true);
      setError("");

      try {
        const res = await searchBooks(
          {
            page: nextPage,
            row_per_page,
            title_prefix,
            sort_by: "title",
            sort_order: "asc",
          },
          { signal: ac.signal }
        );

        setMeta(res);
        setBooks((prev) => (append ? [...prev, ...(res.books ?? [])] : (res.books ?? [])));
        setPage(nextPage);
      } catch (e) {
        if (!ac.signal.aborted) setError(e.message || "Failed to search books");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }

      // In case caller wants to abort manually (rare)
      return () => ac.abort();
    },
    [row_per_page, title_prefix, prefixKey]
  );

  // Initial load
  useEffect(() => {
    if (!title_prefix || title_prefix.length === 0) return;
    fetchPage(0, { append: false });
  }, [fetchPage, prefixKey, title_prefix]);

  const loadMore = useCallback(() => {
    return fetchPage(page + 1, { append: true });
  }, [fetchPage, page]);

  return { books, meta, loading, error, loadMore, page };
}
