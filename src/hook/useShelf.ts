"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "my-shelf";

export function useShelf() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedIds(JSON.parse(stored));
      } catch {
        setSavedIds([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    }
  }, [savedIds, isLoaded]);

  const toggleSave = useCallback((bookId: string) => {
    setSavedIds((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId],
    );
  }, []);

  const isSaved = useCallback(
    (bookId: string) => savedIds.includes(bookId),
    [savedIds],
  );

  const remove = useCallback((bookId: string) => {
    setSavedIds((prev) => prev.filter((id) => id !== bookId));
  }, []);

  return { savedIds, toggleSave, isSaved, remove, isLoaded };
}
