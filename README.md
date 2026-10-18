
<div align="center">

# Curated Book Discoveries

**A slow-browsing, 3D book gallery for readers who want to *feel* their way to their next favorite story.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![CSS 3D](https://img.shields.io/badge/CSS_3D-Transforms-c4a0e8?style=for-the-badge&logo=css3&logoColor=white)](#)

[![Status](https://img.shields.io/badge/status-live-a78bfa?style=for-the-badge)](https://github.com/najmahares/curated-books)
[![License](https://img.shields.io/badge/license-MIT-3d0b43?style=for-the-badge)](LICENSE)
[![Made by](https://img.shields.io/badge/made_by-Najma_Hares-e8c4f8?style=for-the-badge)](https://github.com/najmahares)

[**Live Demo**](https://your-live-link.com) · [**Report a Bug**](https://github.com/najmahares/curated-books/issues) · [**Request a Feature**](https://github.com/najmahares/curated-books/issues)

</div>

---

## Why this exists

Modern book discovery is optimized for feeds and engagement metrics — not for the quiet joy of browsing a shelf. Goodreads is exhaustive but exhausting. StoryGraph is thoughtful but utilitarian. Fable is social but loud. None of them make browsing *pleasurable*.

**Curated Book Discoveries** is the counter-position: a slow, atmospheric space where each book is treated like an object worth holding. Cards lift in 3D toward your cursor, flip to reveal their blurb, and can be saved to a personal shelf that lives in your browser. Star-rain drifts down the page, orbs float behind the layout, and the hero rotates a 3D "Book of the Day" that pauses when you hover to read the quote on its back.


---

## Features

<table>
<tr>
<td width="50%" valign="top">

###  3D Interaction
- **Card lift & tilt** — covers rotate toward the cursor on hover
- **Flip-to-back** — clicking flips the card to reveal blurb, tags, and rating
- **Rotating Book of the Day** — front/back 3D flip on a continuous loop, pauses on hover

### Discovery
- **100+ hand-curated books** across six genres
- **Genre-sorted gallery** with icons, counts, and staggered entrances
- **Sticky filter bar**, live search + tag pills that appear on scroll
- **"You Might Also Enjoy"** — tag-overlap recommendation engine

</td>
<td width="50%" valign="top">

### Personal Shelf
- **Save / remove books** — persisted via `localStorage`
- **Slide-out shelf drawer** — see everything you've saved
- **Heart button** on every cover for one-tap saving

### Atmosphere
- **Star-rain** - 80 drifting particles with custom drift
- **Floating orbs** - blurred radial gradients drifting behind content
- **Custom glowing cursor** - with trail and hover states
- **Respects `prefers-reduced-motion`** — all motion disables cleanly

</td>
</tr>
</table>

---

##  Tech Stack

<div align="center">

| Layer | Tech |
|:---|:---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **UI Runtime** | [React 19](https://react.dev) |
| **Language** | [TypeScript](https://www.typescriptlang.org) (strict) |
| **Styling** | Vanilla CSS with custom properties + [Tailwind v4](https://tailwindcss.com) |
| **Animation** | CSS 3D transforms + `requestAnimationFrame` · [Framer Motion](https://www.framer.com/motion/) (available) |
| **Images** | [`next/image`](https://nextjs.org/docs/app/api-reference/components/image) with [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers) |
| **Persistence** | `localStorage` via a custom `useShelf` hook |
| **Deployment** | [Vercel](https://vercel.com) |

</div>



##  Engineering notes

- **Zero re-renders during hover.** Card tilt is driven by a single `mousemove` handler that reads the bounding rect once per frame and writes directly to `transform`. No React state churn during interaction.
- **Clean animation lifecycle.** The Book of the Day rotation runs on `requestAnimationFrame` and cancels on unmount — no leaked frames, no drift after navigation.
- **Swap-friendly persistence.** `useShelf` abstracts `localStorage` behind `toggleSave` / `isSaved` / `remove`, so the UI reads like a server-backed feature. Moving to Supabase or Prisma later is a drop-in swap, not a rewrite.
- **Motion that respects users.** A global `@media (prefers-reduced-motion: reduce)` block disables star-rain, orbs, the custom cursor, and auto-rotation for users who need it.
- **Recommendations on demand.** `getSimilarBooks` scores tag overlap in O(n) and only runs when a modal opens — not on every render.

---

## Getting started

```bash
# 1. Clone
git clone https://github.com/najmahares/curated-books.git
cd curated-books

# 2. Install
npm install

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | What it does |
|:---|:---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## Project structure

```
src/
├── app/
│   ├── globals.css          # Design tokens, atmosphere, all component styles
│   ├── layout.tsx           # Root layout + font loading (Playfair Display, Inter)
│   └── page.tsx             # Home — hero, genre gallery, shelf, modal
├── components/
│   ├── BookCard3D.tsx       # 3D hover/tilt card
│   ├── BookCardFlipWrapper.tsx  # Flip-front → flip-back interaction
│   ├── BookModal.tsx        # Full detail modal + similar books
│   └── MyShelf.tsx          # Heart button + useShelf hook
├── data/
│   └── books.ts             # Book interface + 100+ curated entries
└── ...
```



##  License

[MIT](LICENSE).

---

## Author

<div align="center">

**Najma Hares Muhumed**

[![Email](https://img.shields.io/badge/Email-haresnajma@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:haresnajma@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-najmahares-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/najmahares)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-najmahares-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/najmahares)

</div>

<div align="center">

**If this project helped you or inspired a book pick, drop a ⭐, it means a lot.**

</div>
