"use client";

import { Book } from "@/data/books";
import { useState } from "react";
import { BookCard3D } from "./BookCard3D";
import "./BookCardFlipWrapper.css";

interface BookCardFlipWrapperProps {
  book: Book;
  index: number;
  onSelect: (book: Book) => void;
}

export function BookCardFlipWrapper({
  book,
  index,
  onSelect,
}: BookCardFlipWrapperProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // FIX: Separate front click (flip) from back click (select)
  const handleFrontClick = () => {
    setIsFlipped(true);
  };

  const handleBackClick = () => {
    // Only open modal if NOT clicking the Back button
    onSelect(book);
  };

  const handleFlipBack = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop from bubbling to .flip-back onClick
    setIsFlipped(false);
  };

  return (
    <div className={`flip-wrapper ${isFlipped ? "flipped" : ""}`}>
      {/* Front: Click to flip */}
      <div className="flip-front">
        <BookCard3D book={book} index={index} onSelect={handleFrontClick} />
      </div>

      {/* Back: Click to open modal, EXCEPT the Back button */}
      <div className="flip-back" onClick={handleBackClick}>
        <div className="flip-back-inner">
          <h4 className="flip-back-title">{book.title}</h4>
          <p className="flip-back-author">by {book.author}</p>
          <div className="flip-back-rating">
            {"★".repeat(Math.floor(book.rating))}
            <span className="flip-back-rating-num">{book.rating}</span>
          </div>
          <p className="flip-back-blurb">
            {book.description.length > 140
              ? book.description.slice(0, 140) + "..."
              : book.description}
          </p>
          <div className="flip-back-tags">
            {book.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="flip-back-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="flip-back-actions">
            <button
              className="flip-back-btn flip-back-btn-secondary"
              onClick={handleFlipBack}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
