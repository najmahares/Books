"use client";

import { HeartButton } from "./MyShelf";
import { Book } from "@/data/books";
import Image from "next/image";
import { useState, useRef } from "react";
import "./BookCard3D.css";

interface BookCard3DProps {
  book: Book;
  index: number;
  onSelect: (book: Book) => void;
}

export function BookCard3D({ book, index, onSelect }: BookCard3DProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateY = (mouseX / (rect.width / 2)) * 15;
    const rotateX = -(mouseY / (rect.height / 2)) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="book-card-wrapper"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div
        ref={cardRef}
        className={`book-card ${isHovered ? "hovered" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(book)}
        style={{
          transform: `
            perspective(1000px)
            rotateX(${rotation.x}deg)
            rotateY(${rotation.y}deg)
            ${isHovered ? "translateZ(30px)" : "translateZ(0)"}
          `,
          // Fix: Force this element into its own compositing layer
          // so 3D transforms don't bleed through the background overlay
          willChange: "transform",
        }}
      >
        <div className="book-cover">
          <Image
            src={book.cover}
            alt={`${book.title} cover`}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="cover-image"
            priority={index < 4}
            // Fix: Add explicit sizes to prevent layout shift
            // and ensure Next.js generates correct srcset
          />
          <HeartButton bookId={book.id} />

          <div className="book-overlay">
            <div className="book-info">
              <span className="book-genre" style={{ color: book.color }}>
                {book.genre}
              </span>
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <div className="book-rating">
                <span className="stars">
                  {"★".repeat(Math.floor(book.rating))}
                </span>
                <span className="rating-number">{book.rating}</span>
              </div>
              <span className="book-click-hint">Click to explore</span>
            </div>
          </div>
        </div>

        <div className="book-spine" style={{ backgroundColor: book.color }} />
        <div className="book-pages" />
      </div>
    </div>
  );
}
