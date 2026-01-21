import { useEffect, useState } from "react";
import { groupBooks } from "../../../api/booksApi";

export function useGroupedBooks({ group_size = 4 } = {}) {
  const [data, setData] = useState(null); // { groups: {A:[], ...} }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError("");

    groupBooks(
      {
        group_by: "title_first_letter",
        group_size,
        page: 0,
        groups_per_page: 26,
      },
      { signal: ac.signal }
    )
      .then(setData)
      .catch((e) => {
        if (ac.signal.aborted) return;
        setError(e.message || "Failed to load grouped books");
      })
      .finally(() => {
        if (ac.signal.aborted) return;
        setLoading(false);
      });

    return () => ac.abort();
  }, [group_size]);

  return { data, loading, error };
}
