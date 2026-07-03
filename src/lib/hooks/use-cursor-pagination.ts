"use client";
import { useState, useCallback } from "react";

/**
 * Cursor pagination state for large datasets (millions of rows).
 * The server returns { data, nextCursor }. We keep a stack of cursors to go back.
 * Use with the MEDA API client: pass the cursor to your endpoint, get the next one back.
 */
export function useCursorPagination<T>(
  fetchPage: (cursor: string | null) => Promise<{ data: T[]; nextCursor: string | null }>
) {
  const [data, setData] = useState<T[]>([]);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const load = useCallback(async (cursor: string | null) => {
    setLoading(true);
    try {
      const res = await fetchPage(cursor);
      setData(res.data);
      setNextCursor(res.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  const next = useCallback(() => {
    if (!nextCursor) return;
    setCursorStack((s) => [...s, nextCursor]);
    setPage((p) => p + 1);
    load(nextCursor);
  }, [nextCursor, load]);

  const prev = useCallback(() => {
    if (cursorStack.length <= 1) return;
    const stack = cursorStack.slice(0, -1);
    setCursorStack(stack);
    setPage((p) => Math.max(1, p - 1));
    load(stack[stack.length - 1]);
  }, [cursorStack, load]);

  return {
    data, loading, page,
    hasNext: nextCursor !== null,
    hasPrev: cursorStack.length > 1,
    next, prev,
    reload: () => load(cursorStack[cursorStack.length - 1]),
    init: () => load(null),
  };
}
