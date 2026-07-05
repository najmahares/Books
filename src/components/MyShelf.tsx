"use client";

import { Book } from "@/data/books";
import Image from "next/image";
import { useState } from "react";
import { useShelf } from "@/hook/useShelf";
import "./MyShelf.css";

interface MyShelfProps {
  allBooks: Book[];
  onSelectBook: (book: Book) => void;
}

export function MyShelf({ allBooks, onSelectBook }: MyShelfProps) {
  const { savedIds, remove } = useShelf();
  const [isOpen, setIsOpen] = useState(false);

  const savedBooks = allBooks.filter((b) => savedIds.includes(b.id));

  return (
    <>
      <button
        className={`shelf-toggle ${savedIds.length > 0 ? "has-items" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="My Shelf"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
        {savedIds.length > 0 && (
          <span className="shelf-badge">{savedIds.length}</span>
        )}
      </button>

      <div className={`shelf-panel ${isOpen ? "open" : ""}`}>
        <div className="shelf-header">
          <h3 className="shelf-title">My Shelf</h3>
          <button className="shelf-close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        {savedBooks.length === 0 ? (
          <div className="shelf-empty">
            <span className="shelf-empty-icon">📚</span>
            <p>No books saved yet.</p>
            <p className="shelf-empty-hint">
              Click the heart on any book to add it here.
            </p>
          </div>
        ) : (
          <div className="shelf-list">
            {savedBooks.map((book) => (
              <div
                key={book.id}
                className="shelf-item"
                onClick={() => {
                  onSelectBook(book);
                  setIsOpen(false);
                }}
              >
                <div className="shelf-item-cover">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="shelf-item-info">
                  <p className="shelf-item-title">{book.title}</p>
                  <p className="shelf-item-author">{book.author}</p>
                </div>
                <button
                  className="shelf-item-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(book.id);
                  }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="shelf-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}

interface HeartButtonProps {
  bookId: string;
}

export function HeartButton({ bookId }: HeartButtonProps) {
  const { isSaved, toggleSave } = useShelf();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasSaved = isSaved(bookId);
    toggleSave(bookId);

    if (!wasSaved) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const saved = isSaved(bookId);

  return (
    <button
      className={`heart-button ${saved ? "saved" : ""} ${isAnimating ? "burst" : ""}`}
      onClick={handleClick}
      title={saved ? "Remove from shelf" : "Add to shelf"}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
