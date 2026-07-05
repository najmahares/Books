"use client";

import { books, genres } from "@/data/books";
import { BookCardFlipWrapper } from "@/components/BookCardFlipWrapper";
import { BookModal } from "@/components/BookModal";
import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import type { Book } from "@/data/books";

function StarRain() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${3 + Math.random() * 7}s`,
      delay: `${Math.random() * 10}s`,
      driftX: `${(Math.random() - 0.5) * 100}px`,
      size: Math.random() > 0.8 ? 3 : 2,
    }));
  }, []);

  return (
    <div className="star-rain">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            width: star.size,
            height: star.size,
            animationDuration: star.duration,
            animationDelay: star.delay,
            ["--drift-x" as string]: star.driftX,
          }}
        />
      ))}
    </div>
  );
}

function BookOfTheDay({
  book,
  onSelect,
}: {
  book: Book;
  onSelect: (book: Book) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationId: number;
    let startTime: number;
    let pausedRotation = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newRotation = isHovered ? pausedRotation : (elapsed / 90) % 360;
      pausedRotation = newRotation;
      setRotation(newRotation);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  return (
    <div
      className="book-of-day"
      onClick={() => onSelect(book)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="book-of-day-label">Book of the Day</div>
      <div
        className="book-of-day-card"
        style={{
          transform: `perspective(1400px) rotateY(${rotation}deg)`,
        }}
      >
        <div className="book-of-day-front">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            sizes="300px"
            className="book-of-day-cover"
            priority
          />
        </div>
        <div className="book-of-day-back">
          <div className="book-of-day-quote">"{book.quote}"</div>
          <div className="book-of-day-author">— {book.author}</div>
        </div>
      </div>
      <div className="book-of-day-title">{book.title}</div>
    </div>
  );
}

const genreIcons: Record<string, string> = {
  Romantasy: "🔮",
  "Sci-Fi": "🚀",
  Design: "🎨",
  History: "📜",
  Philosophy: "🦉",
  "Self-Help": "⚡",
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const bookOfTheDay = useMemo(() => {
    return books.find((b) => b.id === "r16") || books[0];
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowFilterBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (activeTags.length > 0) {
      result = result.filter((b) =>
        activeTags.some((tag) => b.tags.includes(tag)),
      );
    }

    return result;
  }, [searchQuery, activeTags]);

  const booksByGenre = useMemo(() => {
    if (searchQuery || activeTags.length > 0) {
      return [{ genre: "Results", books: filteredBooks }];
    }

    return genres.map((genre) => ({
      genre,
      books: books.filter((b) => b.genre === genre),
    }));
  }, [filteredBooks, searchQuery, activeTags]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    books.forEach((b) => b.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTags([]);
  };

  return (
    <>
      <StarRain />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className={`filter-bar ${showFilterBar ? "visible" : ""}`}>
        <div className="filter-search">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-tags">
          {allTags.slice(0, 6).map((tag) => (
            <button
              key={tag}
              className={`filter-tag ${activeTags.includes(tag) ? "active" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        {(searchQuery || activeTags.length > 0) && (
          <button className="filter-clear" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      <main ref={mainRef} style={{ position: "relative", zIndex: 1 }}>
        <section className="hero">
          <div className="hero-left">
            <div className="hero-content">
              <p className="hero-eyebrow">Curated Discoveries</p>
              <h1 className="hero-title">
                <span>Books That</span>
                <span className="text-gradient">Shape Worlds</span>
              </h1>
              <p className="hero-subtitle">
                A magical collection of romantasy, sci-fi, and timeless reads,
                each one chosen to transport you to another realm.
              </p>

              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-number">{books.length}</span>
                  <span className="hero-stat-label">Books</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-number">{genres.length}</span>
                  <span className="hero-stat-label">Genres</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-number">4.3</span>
                  <span className="hero-stat-label">Avg Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <BookOfTheDay book={bookOfTheDay} onSelect={setSelectedBook} />
          </div>
        </section>

        {booksByGenre.map(({ genre, books: genreBooks }) => (
          <section key={genre} className="genre-section">
            <div className="genre-header">
              <div className="genre-icon">{genreIcons[genre] || "📚"}</div>
              <h2 className="genre-name">{genre}</h2>
              <span className="genre-count">{genreBooks.length} books</span>
            </div>
            {genreBooks.length > 0 ? (
              <div className="book-grid">
                {genreBooks.map((book, index) => (
                  <BookCardFlipWrapper
                    key={book.id}
                    book={book}
                    index={index}
                    onSelect={setSelectedBook}
                  />
                ))}
              </div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  padding: "2rem",
                }}
              >
                No books match your filters. Try adjusting your search!
              </p>
            )}
          </section>
        ))}

        <footer className="footer">
          <div className="footer-quote-large">"</div>
          <p className="footer-quote">
            I have always imagined that Paradise will be a kind of library.
            There is no surer foundation for a beautiful friendship than a
            mutual taste in literature. Until I feared I would lose it, I never
            loved to read. One does not love breathing.
          </p>
          <p className="footer-attribution">— Inspired by Jorge Luis Borges</p>
          <div className="footer-divider" />
          <div className="footer-bottom">
            <span>Made with</span>
            <span className="footer-heart">♥</span>
            <span>for book lovers</span>
          </div>
        </footer>
      </main>

      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        allBooks={books}
        onSelectBook={setSelectedBook}
      />
    </>
  );
}
