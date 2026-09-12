"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/lib/supabase";

type TcgSlug =
  | "pokemon"
  | "riftbound"
  | "yugioh";

type MediaMap = Partial<
  Record<TcgSlug, string>
>;

const games: {
  slug: TcgSlug;
  name: string;
  href: string;
  detail: string;
  marker: string;
  tone: string;
  chip: string;
}[] = [
  {
    slug: "pokemon",
    name: "Pokémon",
    href: "/pokemon",
    detail:
      "Expansiones, sellado, cartas individuales y accesorios.",
    marker: "01",
    tone: "home-pokemon",
    chip: "Coleccionable",
  },
  {
    slug: "riftbound",
    name: "Riftbound",
    href: "/riftbound",
    detail:
      "Lanzamientos, preventas y cartas para construir tu siguiente mazo.",
    marker: "02",
    tone: "home-riftbound",
    chip: "Estrategia",
  },
  {
    slug: "yugioh",
    name: "Yu-Gi-Oh!",
    href: "/yugioh",
    detail:
      "Producto sellado, staples y cartas para duelo.",
    marker: "03",
    tone: "home-yugioh",
    chip: "Competitivo",
  },
];

const picks = [
  {
    name:
      "Destined Rivals",
    game: "Pokémon",
    href: "/pokemon",
    tag: "Nueva expansión",
    color: "pick-pokemon",
  },
  {
    name:
      "Spiritforged",
    game: "Riftbound",
    href: "/riftbound",
    tag: "Preventa",
    color: "pick-riftbound",
  },
  {
    name:
      "Alliance Insight",
    game: "Yu-Gi-Oh!",
    href: "/yugioh",
    tag: "Producto sellado",
    color: "pick-yugioh",
  },
  {
    name:
      "Colecciones premium",
    game: "Pokémon",
    href: "/pokemon",
    tag: "Para coleccionar",
    color: "pick-pokemon",
  },
];

const styles = `
.home-page {
  min-height: 100vh;
  background: #07101f;
  color: #f5f7ff;
  overflow-x: hidden;
}

/* ==========================
   HERO
========================== */

.home-intro {
  position: relative;
  min-height: 100vh;
  padding:
    130px
    clamp(24px, 6vw, 105px)
    70px;

  display: grid;
  grid-template-columns:
    minmax(0, 1.05fr)
    minmax(340px, .95fr);
  align-items: center;
  gap: clamp(28px, 6vw, 70px);

  background:
    radial-gradient(
      circle at 12% 22%,
      rgba(82, 152, 255, 0.26),
      transparent 28%
    ),
    radial-gradient(
      circle at 85% 15%,
      rgba(161, 88, 255, 0.24),
      transparent 30%
    ),
    radial-gradient(
      circle at 82% 82%,
      rgba(63, 225, 205, 0.16),
      transparent 24%
    ),
    linear-gradient(
      145deg,
      #07101f 0%,
      #0c1831 48%,
      #12142c 100%
    );
}

.home-intro::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      rgba(255,255,255,.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,.035) 1px,
      transparent 1px
    );
  background-size: 48px 48px;
  mask-image: linear-gradient(
    180deg,
    rgba(0,0,0,.9),
    rgba(0,0,0,.45)
  );
  pointer-events: none;
}

.home-intro::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 180px;
  background:
    linear-gradient(
      180deg,
      rgba(7,16,31,0),
      #07101f
    );
  pointer-events: none;
}

.home-intro-copy,
.hero-stage {
  position: relative;
  z-index: 2;
}

.home-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 25px;

  color: #9fb1cf;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .18em;
}

.home-kicker::before {
  content: "";
  width: 30px;
  height: 1px;
  background: rgba(159,177,207,.8);
}

.home-intro h1 {
  margin: 0;
  max-width: 760px;

  font:
    800
    clamp(68px, 9vw, 150px)
    /.8
    Arial,
    Helvetica,
    sans-serif;
  letter-spacing: -.085em;
  color: #f5f8ff;
}

.home-intro h1 i {
  display: inline-block;
  font-style: italic;
  color: #ff5978;
  text-shadow:
    0 4px 0 #ffd758,
    0 20px 40px rgba(255, 89, 120, .22);
}

.home-intro-message {
  max-width: 580px;
  margin: 28px 0 0;
  color: #b6c3d9;
  font-size: 15px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 13px;
  margin-top: 34px;
}

.hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 22px;

  min-height: 48px;
  padding: 0 18px;

  border-radius: 999px;
  background: linear-gradient(
    135deg,
    #ffffff,
    #d9f8ff
  );
  color: #091123;
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;

  box-shadow:
    0 10px 30px rgba(0, 0, 0, .22);

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.hero-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, .28);
}

.hero-secondary {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 18px;

  border: 1px solid
    rgba(255,255,255,.12);
  border-radius: 999px;

  background: rgba(255,255,255,.04);
  color: #edf2ff;
  text-decoration: none;
  font-size: 13px;

  backdrop-filter: blur(8px);
}

.hero-meta {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 34px;
  max-width: 620px;
}

.hero-meta-card {
  padding: 14px 14px 13px;
  border: 1px solid
    rgba(255,255,255,.08);
  border-radius: 16px;
  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,.06),
      rgba(255,255,255,.03)
    );
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06);
}

.hero-meta-card b {
  display: block;
  margin-bottom: 5px;
  color: #ffffff;
  font-size: 13px;
}

.hero-meta-card span {
  color: #9fb1cf;
  font-size: 11px;
  line-height: 1.45;
}

/* ==========================
   HERO RIGHT SIDE
========================== */

.hero-stage {
  display: grid;
  gap: 18px;
}

.stage-panel {
  position: relative;
  overflow: hidden;

  border: 1px solid
    rgba(255,255,255,.08);
  border-radius: 30px;

  background:
    linear-gradient(
      160deg,
      rgba(255,255,255,.08),
      rgba(255,255,255,.03)
    );
  backdrop-filter: blur(16px);

  box-shadow:
    0 30px 80px rgba(0,0,0,.28);
}

.stage-panel::before {
  content: "";
  position: absolute;
  inset: auto -20% -35% auto;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle,
      rgba(110, 225, 216, .22),
      transparent 65%
    );
  pointer-events: none;
}

.stage-feature {
  padding: 26px;
}

.stage-feature small {
  display: block;
  margin-bottom: 10px;

  color: #8fa7c8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .18em;
  text-transform: uppercase;
}

.stage-feature h2 {
  margin: 0 0 22px;
  color: #fff;
  font:
    400
    clamp(32px, 4vw, 48px)
    /.95
    Georgia,
    serif;
  letter-spacing: -.05em;
}

.stage-list {
  display: grid;
  gap: 12px;
}

.stage-link {
  min-height: 78px;
  display: grid;
  grid-template-columns:
    46px
    1fr
    auto;
  align-items: center;
  gap: 14px;

  padding: 12px 14px;

  border: 1px solid
    rgba(255,255,255,.08);
  border-radius: 18px;

  background:
    rgba(255,255,255,.045);

  text-decoration: none;
  color: #fff;

  transition:
    transform .2s ease,
    border-color .2s ease,
    background .2s ease;
}

.stage-link:hover {
  transform: translateX(4px);
  background: rgba(255,255,255,.07);
  border-color: rgba(255,255,255,.16);
}

.stage-num {
  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  border-radius: 50%;
  background: #091123;
  color: #fff;

  font-size: 11px;
  font-weight: 800;
}

.stage-logo {
  display: block;
  width: min(136px, 100%);
  height: 34px;
  object-fit: contain;
  object-position: left center;
}

.stage-fallback {
  font-size: 14px;
  font-weight: 800;
}

.stage-arrow {
  color: #88a4cf;
  font-size: 18px;
}

.stage-bottom {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  padding: 0 26px 26px;
}

.stage-chip {
  padding: 14px 12px;
  border-radius: 16px;
  background:
    rgba(255,255,255,.05);
  border: 1px solid
    rgba(255,255,255,.06);
}

.stage-chip b {
  display: block;
  margin-bottom: 5px;
  color: #fff;
  font-size: 12px;
}

.stage-chip span {
  color: #90a2c2;
  font-size: 10px;
  line-height: 1.4;
}

/* ==========================
   TRANSITION
========================== */

.home-transition {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding:
    22px
    clamp(20px, 4vw, 64px);

  background:
    linear-gradient(
      180deg,
      #07101f,
      #091327
    );
  border-top: 1px solid
    rgba(255,255,255,.05);
  border-bottom: 1px solid
    rgba(255,255,255,.06);

  color: #8fa0be;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.home-transition span:last-child {
  color: #6fe2d6;
}

/* ==========================
   GAME LINKS
========================== */

.game-links {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 16px;

  padding:
    clamp(38px, 5vw, 66px)
    clamp(20px, 4vw, 64px)
    clamp(60px, 7vw, 95px);

  background:
    radial-gradient(
      circle at 100% 0,
      rgba(69,230,214,.12),
      transparent 28%
    ),
    radial-gradient(
      circle at 0 100%,
      rgba(113,89,231,.12),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #091327,
      #0b1323
    );
}

.game-link {
  min-height: 390px;
  padding: 21px;

  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  isolation: isolate;

  border: 1px solid
    rgba(255,255,255,.08);
  border-radius: 24px;

  color: #fff;
  text-decoration: none;

  box-shadow:
    0 22px 55px rgba(0,0,0,.24);

  transition:
    transform .25s ease,
    box-shadow .25s ease;
}

.game-link:hover {
  transform: translateY(-7px);
  box-shadow:
    0 35px 70px rgba(0,0,0,.32);
}

.home-pokemon {
  background:
    linear-gradient(
      135deg,
      #11b8ed,
      #3870d9 48%,
      #f27369
    );
}

.home-riftbound {
  background:
    linear-gradient(
      135deg,
      #1d143e,
      #6955cc 50%,
      #b16ae5
    );
}

.home-yugioh {
  background:
    linear-gradient(
      135deg,
      #1a0a0b,
      #8e2c30 52%,
      #dc733e
    );
}

.game-card-cover {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;

  transition: transform .4s ease;
}

.game-link:hover .game-card-cover {
  transform: scale(1.04);
}

.game-link::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(
      180deg,
      rgba(5,8,18,.08) 0%,
      rgba(5,8,18,.28) 45%,
      rgba(5,8,18,.94) 100%
    );
}

.game-shape {
  position: absolute;
  right: -16px;
  top: 57px;
  z-index: -1;
  width: 70%;
  aspect-ratio: .7;
  transform: rotate(13deg);

  border: 2px solid
    rgba(255,255,255,.58);
  border-radius: 7px;
}

.game-shape span {
  display: block;
  height: 1px;
  margin: 20%;
  background:
    rgba(255,255,255,.38);
}

.game-link-top {
  display: flex;
  justify-content: space-between;
  gap: 20px;

  font-size: 11px;
  font-weight: 700;
}

.game-link-top span {
  padding-bottom: 4px;
  border-bottom: 1px solid
    rgba(255,255,255,.7);
}

.game-card-logo {
  display: block;
  width: min(270px, 76%);
  max-height: 86px;
  margin-bottom: 14px;
  object-fit: contain;
  object-position: left center;

  filter:
    drop-shadow(
      0 8px 16px rgba(0,0,0,.35)
    );
}

.game-link h2 {
  margin: 0 0 14px;
  font:
    400
    clamp(42px, 4vw, 65px)
    /.9
    Georgia,
    serif;
  letter-spacing: -.055em;
}

.game-chip {
  display: inline-flex;
  width: max-content;
  margin-bottom: 10px;
  padding: 7px 10px;

  border-radius: 999px;
  background:
    rgba(255,255,255,.12);
  border: 1px solid
    rgba(255,255,255,.16);

  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.game-link p {
  max-width: 300px;
  margin: 0;

  color: rgba(255,255,255,.9);
  font-size: 13px;
  line-height: 1.48;
}

/* ==========================
   PICKS
========================== */

.home-carousel {
  padding:
    clamp(65px, 8vw, 115px)
    clamp(20px, 7vw, 112px);

  background:
    linear-gradient(
      180deg,
      #11172a,
      #0d1425
    );

  color: #f6f7fb;
}

.carousel-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 32px;
}

.carousel-heading p {
  margin: 0 0 16px;
  color: #8f9ab5;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .15em;
}

.carousel-heading h2 {
  margin: 0;
  color: #fff;
  font:
    400
    clamp(45px, 5vw, 76px)
    /.88
    Georgia,
    serif;
  letter-spacing: -.06em;
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.carousel-controls button {
  width: 39px;
  height: 39px;
  border: 1px solid #66708c;
  border-radius: 50%;
  background: transparent;
  color: #fff;
  font-size: 18px;
}

.carousel-controls button:hover {
  background: #fff;
  color: #0b1020;
}

.carousel-track {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 15px;
}

.pick-card {
  min-height: 355px;
  padding: 17px;

  display: flex;
  flex-direction: column;

  position: relative;
  overflow: hidden;

  border-radius: 18px;
  color: #fff;
}

.pick-pokemon {
  background:
    linear-gradient(
      135deg,
      #ff4c3b,
      #f2a321
    );
}

.pick-riftbound {
  background:
    linear-gradient(
      135deg,
      #32215c,
      #6b5de6
    );
}

.pick-yugioh {
  background:
    linear-gradient(
      135deg,
      #1c1013,
      #9d332c
    );
}

.pick-art {
  height: 205px;
  border: 1px solid
    rgba(255,255,255,.55);
  background:
    rgba(255,255,255,.09);

  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.pick-art span {
  position: relative;
  z-index: 2;

  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .11em;
}

.pick-art i {
  position: absolute;
  width: 42%;
  aspect-ratio: .7;
  border: 1px solid
    rgba(255,255,255,.7);
  border-radius: 5px;
  transform:
    rotate(16deg)
    translate(36px, 22px);
  background:
    rgba(255,255,255,.12);
}

.pick-art i + i {
  transform:
    rotate(-12deg)
    translate(-22px, 20px);
}

.pick-card > p {
  margin: 18px 0 8px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .12em;
  opacity: .78;
}

.pick-card h3 {
  margin: 0;
  font:
    400 30px/.95 Georgia,
    serif;
  letter-spacing: -.045em;
}

.pick-card footer {
  margin-top: auto;
  padding-top: 13px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  border-top: 1px solid
    rgba(255,255,255,.36);

  font-size: 12px;
}

.pick-card footer a {
  color: #fff;
  text-decoration: none;
}

/* ==========================
   RESPONSIVE
========================== */

@media (max-width: 1100px) {
  .home-intro {
    min-height: auto;
    grid-template-columns: 1fr;
    padding-top: 115px;
  }
}

@media (max-width: 850px) {
  .game-links,
  .carousel-track {
    grid-template-columns: 1fr;
  }

  .hero-meta {
    grid-template-columns: 1fr;
  }

  .stage-bottom {
    grid-template-columns: 1fr;
  }

  .game-link {
    min-height: 330px;
  }

  .carousel-track .pick-card:nth-child(3) {
    display: none;
  }

  .carousel-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .home-intro {
    padding:
      105px 20px 55px;
  }

  .home-intro h1 {
    font-size: 68px;
  }

  .stage-feature {
    padding: 22px;
  }

  .stage-bottom {
    padding:
      0 22px 22px;
  }

  .home-transition {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

export default function Home() {
  const [start, setStart] =
    useState(0);

  const [intro, setIntro] =
    useState("");

  const [covers, setCovers] =
    useState<MediaMap>({});

  const [logos, setLogos] =
    useState<MediaMap>({});

  useEffect(() => {
    setIntro(
      window.localStorage.getItem(
        "tcg-home-intro"
      ) || ""
    );
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client =
      supabase;

    const createMap = (
      rows:
        | {
            tcg: string;
            storage_path: string;
          }[]
        | null
    ) => {
      const next: MediaMap =
        {};

      for (const row of rows ?? []) {
        if (
          ![
            "pokemon",
            "riftbound",
            "yugioh",
          ].includes(row.tcg)
        ) {
          continue;
        }

        const { data } =
          client.storage
            .from(
              "catalog-images"
            )
            .getPublicUrl(
              row.storage_path
            );

        next[
          row.tcg as TcgSlug
        ] = data.publicUrl;
      }

      return next;
    };

    const loadMedia =
      async () => {
        const [
          coverResult,
          logoResult,
        ] =
          await Promise.all([
            client
              .from(
                "home_covers"
              )
              .select(
                "tcg,storage_path"
              ),
            client
              .from("tcg_logos")
              .select(
                "tcg,storage_path"
              ),
          ]);

        if (
          coverResult.error
        ) {
          console.error(
            "No se pudieron cargar las portadas:",
            coverResult.error
          );
        } else {
          setCovers(
            createMap(
              coverResult.data
            )
          );
        }

        if (
          logoResult.error
        ) {
          console.error(
            "No se pudieron cargar los logos:",
            logoResult.error
          );
        } else {
          setLogos(
            createMap(
              logoResult.data
            )
          );
        }
      };

    loadMedia();
  }, []);

  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setStart(
            (current) =>
              (current + 1) %
              picks.length
          );
        },
        4500
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, []);

  const visible =
    [0, 1, 2].map(
      (offset) =>
        picks[
          (start + offset) %
            picks.length
        ]
    );

  return (
    <>
      <style>
        {styles}
      </style>

      <main className="home-page">
        <SiteHeader
          variant="light"
        />

        <section className="home-intro">
          <div className="home-intro-copy">
            <p className="home-kicker">
              Cartas
              coleccionables ·
              México
            </p>

            <h1>
              Elige tu
              <br />
              <i>
                universo.
              </i>
            </h1>

            <p className="home-intro-message">
              {intro ||
                "Encuentra cartas, expansiones y coleccionables de tus TCG favoritos en un solo lugar con una experiencia más clara, rápida y visual."}
            </p>

            <div className="hero-actions">
              <a
                className="hero-primary"
                href="#universos"
              >
                Explorar
                catálogos
                <span>
                  ↓
                </span>
              </a>

              <Link
                className="hero-secondary"
                href="/pokemon"
              >
                Ver Pokémon ↗
              </Link>
            </div>

            <div className="hero-meta">
              <div className="hero-meta-card">
                <b>
                  Productos
                </b>
                <span>
                  Sellado,
                  individuales y
                  accesorios.
                </span>
              </div>

              <div className="hero-meta-card">
                <b>
                  Catálogos
                </b>
                <span>
                  Pokémon,
                  Riftbound y
                  Yu-Gi-Oh!
                </span>
              </div>

              <div className="hero-meta-card">
                <b>
                  Pokeamigos
                </b>
                <span>
                  Un solo lugar
                  para explorar
                  todo.
                </span>
              </div>
            </div>
          </div>

          <div className="hero-stage">
            <section className="stage-panel">
              <div className="stage-feature">
                <small>
                  POKEAMIGOS
                </small>

                <h2>
                  Explora los
                  universos que
                  más te gustan.
                </h2>

                <div className="stage-list">
                  {games.map(
                    (
                      game,
                      index
                    ) => (
                      <Link
                        className="stage-link"
                        href={
                          game.href
                        }
                        key={
                          game.slug
                        }
                      >
                        <span className="stage-num">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        {logos[
                          game.slug
                        ] ? (
                          <img
                            className="stage-logo"
                            src={
                              logos[
                                game
                                  .slug
                              ]
                            }
                            alt={`Logo ${game.name}`}
                          />
                        ) : (
                          <span className="stage-fallback">
                            {
                              game.name
                            }
                          </span>
                        )}

                        <span className="stage-arrow">
                          ↗
                        </span>
                      </Link>
                    )
                  )}
                </div>
              </div>

              <div className="stage-bottom">
                <div className="stage-chip">
                  <b>
                    Colecciona
                  </b>
                  <span>
                    Cartas y
                    productos
                    favoritos.
                  </span>
                </div>

                <div className="stage-chip">
                  <b>
                    Construye
                  </b>
                  <span>
                    Tu siguiente
                    mazo y estrategia.
                  </span>
                </div>

                <div className="stage-chip">
                  <b>
                    Descubre
                  </b>
                  <span>
                    Lanzamientos y
                    novedades.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </section>

        <div className="home-transition">
          <span>
            Explora por juego
          </span>

          <span>
            Pokémon · Riftbound
            · Yu-Gi-Oh!
          </span>
        </div>

        <section
          className="game-links"
          id="universos"
        >
          {games.map(
            (game) => (
              <Link
                className={`game-link ${game.tone}`}
                href={
                  game.href
                }
                key={
                  game.slug
                }
              >
                {covers[
                  game.slug
                ] && (
                  <img
                    className="game-card-cover"
                    src={
                      covers[
                        game
                          .slug
                      ]
                    }
                    alt=""
                  />
                )}

                {!covers[
                  game.slug
                ] && (
                  <div
                    className="game-shape"
                    aria-hidden="true"
                  >
                    <span />
                    <span />
                    <span />
                  </div>
                )}

                <div className="game-link-top">
                  <b>
                    {
                      game.marker
                    }
                  </b>

                  <span>
                    Ir al catálogo
                    ↗
                  </span>
                </div>

                <div>
                  <span className="game-chip">
                    {
                      game.chip
                    }
                  </span>

                  {logos[
                    game.slug
                  ] ? (
                    <img
                      className="game-card-logo"
                      src={
                        logos[
                          game.slug
                        ]
                      }
                      alt={`Logo ${game.name}`}
                    />
                  ) : (
                    <h2>
                      {
                        game.name
                      }
                    </h2>
                  )}

                  <p>
                    {
                      game.detail
                    }
                  </p>
                </div>
              </Link>
            )
          )}
        </section>

        <section className="home-carousel">
          <div className="carousel-heading">
            <div>
              <p>
                Recién llegados
              </p>

              <h2>
                Lo que todos
                <br />
                quieren abrir.
              </h2>
            </div>

            <div className="carousel-controls">
              <button
                type="button"
                aria-label="Anterior"
                onClick={() =>
                  setStart(
                    (
                      start +
                      picks.length -
                      1
                    ) %
                      picks.length
                  )
                }
              >
                ←
              </button>

              <span>
                {String(
                  start + 1
                ).padStart(
                  2,
                  "0"
                )}
                {" / "}
                {String(
                  picks.length
                ).padStart(
                  2,
                  "0"
                )}
              </span>

              <button
                type="button"
                aria-label="Siguiente"
                onClick={() =>
                  setStart(
                    (start + 1) %
                      picks.length
                  )
                }
              >
                →

              </button>
            </div>
          </div>

          <div className="carousel-track">
            {visible.map(
              (
                pick,
                index
              ) => (
                <article
                  className={`pick-card ${pick.color}`}
                  key={`${pick.name}-${index}`}
                >
                  <div className="pick-art">
                    <span>
                      Producto
                      destacado
                    </span>
                    <i />
                    <i />
                  </div>

                  <p>
                    {pick.tag}
                  </p>

                  <h3>
                    {pick.name}
                  </h3>

                  <footer>
                    <span>
                      {pick.game}
                    </span>

                    <Link
                      href={
                        pick.href
                      }
                    >
                      Ver catálogo
                      ↗
                    </Link>
                  </footer>
                </article>
              )
            )}
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}