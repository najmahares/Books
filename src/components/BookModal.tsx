"use client";

import { Book } from "@/data/books";
import Image from "next/image";
import { useEffect, useCallback } from "react";

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  allBooks: Book[];
  onSelectBook?: (book: Book) => void;
}

function getSimilarBooks(
  book: Book,
  allBooks: Book[],
  count: number = 3,
): Book[] {
  return allBooks
    .filter((b) => b.id !== book.id)
    .map((b) => ({
      book: b,
      score: b.tags.filter((tag) => book.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((item) => item.book);
}

export function BookModal({
  book,
  onClose,
  allBooks,
  onSelectBook,
}: BookModalProps) {
  // FIX: Removed duplicate useEffect — only need ONE body scroll lock
  useEffect(() => {
    if (book) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [book]);

  // FIX: Added useCallback for stable reference in dependency array
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  if (!book) return null;

  const similarBooks = getSimilarBooks(book, allBooks);

  const handleSimilarClick = (similarBook: Book) => {
    if (onSelectBook) {
      onSelectBook(similarBook);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="modal-body">
          <div className="modal-cover">
            <Image
              src={book.cover}
              alt={`${book.title} cover`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className="modal-info">
            <span
              className="modal-genre"
              style={{ color: book.color, background: `${book.color}15` }}
            >
              {book.genre}
            </span>

            <h2 className="modal-title">{book.title}</h2>
            <p className="modal-author">by {book.author}</p>

            <div className="modal-meta">
              <span>{book.year}</span>
              <span className="modal-rating">
                {"★".repeat(Math.floor(book.rating))} {book.rating}
              </span>
            </div>

            <p className="modal-description">{book.description}</p>

            <div className="modal-tags">
              {book.tags.map((tag) => (
                <span key={tag} className="modal-tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* Similar Books */}
            {similarBooks.length > 0 && (
              <div className="similar-books">
                <h3 className="similar-books-title">You Might Also Enjoy</h3>
                <div className="similar-books-grid">
                  {similarBooks.map((similar) => (
                    <div
                      key={similar.id}
                      className="similar-book-card"
                      onClick={() => handleSimilarClick(similar)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="similar-book-cover">
                        <Image
                          src={similar.cover}
                          alt={similar.title}
                          fill
                          sizes="(max-width: 768px) 33vw, 150px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <p className="similar-book-title">{similar.title}</p>
                      <p className="similar-book-author">{similar.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
