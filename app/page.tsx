"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  AuthButton,
} from "@/components/auth-button";

import {
  supabase,
} from "@/lib/supabase";

type TcgSlug =
  | "pokemon"
  | "riftbound"
  | "yugioh";

type MediaMap =
  Partial<
    Record<
      TcgSlug,
      string
    >
  >;

const games: {
  slug: TcgSlug;
  name: string;
  href: string;
  detail: string;
  marker: string;
  tone: string;
}[] = [
  {
    slug: "pokemon",
    name: "Pokémon",
    href: "/pokemon",
    detail:
      "Expansiones, sellado, individuales y accesorios.",
    marker: "01",
    tone: "home-pokemon",
  },
  {
    slug: "riftbound",
    name: "Riftbound",
    href: "/riftbound",
    detail:
      "Lanzamientos, preventas y cartas para tu mazo.",
    marker: "02",
    tone: "home-riftbound",
  },
  {
    slug: "yugioh",
    name: "Yu-Gi-Oh!",
    href: "/yugioh",
    detail:
      "Producto sellado, staples y coleccionables.",
    marker: "03",
    tone: "home-yugioh",
  },
];

const picks = [
  {
    name: "Destined Rivals",
    game: "Pokémon",
    tag: "Nueva expansión",
    color: "pick-pokemon",
  },
  {
    name: "Spiritforged",
    game: "Riftbound",
    tag: "Preventa",
    color: "pick-riftbound",
  },
  {
    name: "Alliance Insight",
    game: "Yu-Gi-Oh!",
    tag: "Producto sellado",
    color: "pick-yugioh",
  },
  {
    name: "Colecciones premium",
    game: "Pokémon",
    tag: "Para coleccionar",
    color: "pick-pokemon",
  },
];

const styles = `
.home-page {
  background: #0b1020;
}

.home-page .shop-header {
  background:
    rgba(245,246,250,.97);
}

.home-intro {
  background:
    radial-gradient(
      circle at 85% 20%,
      #e5c4ff,
      transparent 30%
    ),
    radial-gradient(
      circle at 10% 90%,
      #b8e9ff,
      transparent 30%
    ),
    linear-gradient(
      135deg,
      #eef0ff,
      #f5ebf4
    );
}

.game-links {
  background:
    linear-gradient(
      180deg,
      #11172c,
      #0c1223
    );

  padding-top:
    clamp(
      35px,
      4vw,
      65px
    );

  padding-bottom:
    clamp(
      55px,
      6vw,
      90px
    );
}

.game-link {
  position: relative;
  overflow: hidden;
}

.game-card-cover {
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  object-position: center;

  z-index: 0;

  opacity: .74;
}

.game-link::after {
  content: "";

  position: absolute;

  inset: 0;

  z-index: 1;

  background:
    linear-gradient(
      180deg,
      rgba(5,8,18,.08),
      rgba(5,8,18,.88)
    );
}

.game-link > *:not(.game-card-cover) {
  position: relative;
  z-index: 2;
}

.game-card-logo {
  display: block;

  width:
    min(
      270px,
      75%
    );

  max-height: 85px;

  object-fit: contain;

  object-position:
    left center;

  margin-bottom: 14px;

  filter:
    drop-shadow(
      0 8px 16px
      rgba(0,0,0,.35)
    );
}

.home-carousel {
  padding:
    clamp(65px,8vw,115px)
    clamp(20px,7vw,112px);

  background:
    #11172a;

  color: #f6f7fb;
}

.carousel-heading {
  display:flex;

  align-items:end;
  justify-content:
    space-between;

  margin-bottom:32px;
}

.carousel-heading p {
  font-size:10px;

  text-transform:
    uppercase;

  letter-spacing:.15em;

  font-weight:700;

  color:#8f9ab5;

  margin:0 0 16px;
}

.carousel-heading h2 {
  font:
    400 clamp(
      45px,
      5vw,
      76px
    )/.88
    Georgia,
    serif;

  letter-spacing:-.06em;

  margin:0;

  color: #fff;
}

.carousel-controls {
  display:flex;

  align-items:center;

  gap:12px;

  font-size:12px;
}

.carousel-controls button {
  width:39px;
  height:39px;

  border-radius:50%;

  border:
    1px solid
    #66708c;

  background:
    transparent;

  color: #fff;

  font-size:18px;
}

.carousel-track {
  display:grid;

  grid-template-columns:
    repeat(3,1fr);

  gap:15px;
}

.pick-card {
  color:white;

  padding:17px;

  min-height:355px;

  display:flex;

  flex-direction:column;

  position:relative;

  overflow:hidden;

  border-radius: 18px;
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
  height:205px;

  border:
    1px solid
    rgba(255,255,255,.55);

  background:
    rgba(255,255,255,.09);

  position:relative;

  display:grid;

  place-items:center;

  overflow:hidden;
}

.pick-art span {
  font-size:11px;

  text-transform:
    uppercase;

  letter-spacing:.11em;

  position:relative;

  z-index:2;
}

.pick-art i {
  position:absolute;

  width:42%;

  aspect-ratio:.7;

  border:
    1px solid
    rgba(255,255,255,.7);

  border-radius:5px;

  transform:
    rotate(16deg)
    translate(
      36px,
      22px
    );

  background:
    rgba(
      255,
      255,
      255,
      .12
    );
}

.pick-art i+i {
  transform:
    rotate(-12deg)
    translate(
      -22px,
      20px
    );
}

.pick-card>p {
  font-size:10px;

  text-transform:
    uppercase;

  letter-spacing:.12em;

  opacity:.78;

  margin:
    18px 0 8px;
}

.pick-card h3 {
  font:
    400 30px/.95
    Georgia,
    serif;

  letter-spacing:
    -.045em;

  margin:0;
}

.pick-card footer {
  margin-top:auto;

  border-top:
    1px solid
    rgba(
      255,
      255,
      255,
      .36
    );

  padding-top:13px;

  display:flex;

  align-items:center;

  justify-content:
    space-between;

  font-size:12px;
}

.admin-access {
  display:inline-flex;

  align-items:center;

  justify-content:center;

  padding:9px 14px;

  border:
    1px solid
    rgba(
      11,
      16,
      32,
      .18
    );

  border-radius:
    100px;

  font-size:13px;

  text-decoration:none;
}

.admin-access:hover {
  background:#0b1020;
  color:white;
}

.home-page .store-footer {
  background:#080d1a;

  color:#d7dbea;

  border-top:
    1px solid
    rgba(
      255,
      255,
      255,
      .08
    );
}

.home-page .store-footer a {
  color:#bac1d3;

  text-decoration:none;
}

@media(max-width:800px) {
  .carousel-track {
    grid-template-columns:
      1fr;
  }

  .carousel-track
  .pick-card:nth-child(3) {
    display:none;
  }

  .carousel-heading {
    align-items:
      flex-start;

    flex-direction:
      column;

    gap:22px;
  }
}
`;

export default function Home() {
  const [
    start,
    setStart,
  ] = useState(0);

  const [
    intro,
    setIntro,
  ] = useState("");

  const [
    covers,
    setCovers,
  ] =
    useState<MediaMap>(
      {}
    );

  const [
    logos,
    setLogos,
  ] =
    useState<MediaMap>(
      {}
    );

  useEffect(() => {
    setIntro(
      localStorage.getItem(
        "tcg-home-intro"
      ) || ""
    );
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;

    const createMap = (
      rows:
        | {
            tcg: string;
            storage_path:
              string;
          }[]
        | null
    ) => {
      const map:
        MediaMap = {};

      for (
        const row of
        rows ?? []
      ) {
        if (
          ![
            "pokemon",
            "riftbound",
            "yugioh",
          ].includes(
            row.tcg
          )
        ) {
          continue;
        }

        const {
          data,
        } =
          client.storage
            .from(
              "catalog-images"
            )
            .getPublicUrl(
              row.storage_path
            );

        map[
          row.tcg as TcgSlug
        ] =
          data.publicUrl;
      }

      return map;
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
              .from(
                "tcg_logos"
              )
              .select(
                "tcg,storage_path"
              ),
          ]);

        if (
          !coverResult.error
        ) {
          setCovers(
            createMap(
              coverResult.data
            )
          );
        }

        if (
          !logoResult.error
        ) {
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
              (current +
                1) %
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
          (start +
            offset) %
            picks.length
        ]
    );

  return (
    <>
      <style>{styles}</style>

      <main className="home-page">
        <header className="shop-header">
          <Link
            className="wordmark"
            href="/"
          >
            [ ]{" "}
            <span>
              TCG STORE
            </span>
          </Link>

          <nav>
            <Link href="/pokemon">
              Pokémon
            </Link>

            <Link href="/riftbound">
              Riftbound
            </Link>

            <Link href="/yugioh">
              Yu-Gi-Oh!
            </Link>
          </nav>

          <div className="header-actions">
            <AuthButton />

            <Link
              href="/admin"
              className="admin-access"
            >
              Admin
            </Link>

            <button
              className="bag"
              type="button"
            >
              Carrito{" "}
              <b>0</b>
            </button>
          </div>
        </header>

        <section className="home-intro">
          <p>
            Cartas coleccionables ·
            México
          </p>

          <h1>
            Elige tu
            <br />

            <i>
              universo.
            </i>
          </h1>

          {intro && (
            <span>
              {intro}
            </span>
          )}
        </section>

        <section className="game-links">
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
                  <div className="game-shape">
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
                    Ir al catálogo ↗
                  </span>
                </div>

                <div>
                  {logos[
                    game.slug
                  ] ? (
                    <img
                      className="game-card-logo"
                      src={
                        logos[
                          game
                            .slug
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
                )}{" "}
                /{" "}
                {String(
                  picks.length
                ).padStart(
                  2,
                  "0"
                )}
              </span>

              <button
                type="button"
                onClick={() =>
                  setStart(
                    (start +
                      1) %
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
                      Imagen de
                      producto
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

                    <span>
                      Ver producto ↗
                    </span>
                  </footer>
                </article>
              )
            )}
          </div>
        </section>

        <footer className="store-footer">
          <Link
            className="wordmark"
            href="/"
          >
            [ ]{" "}
            <span>
              TCG STORE
            </span>
          </Link>

          <p>
            Cartas coleccionables ·
            México
          </p>

          <div>
            <Link href="/politica-de-privacidad">
              Política de privacidad
            </Link>

            <Link href="/terminos-y-condiciones">
              Términos y condiciones
            </Link>

            <Link href="/politica-de-envios">
              Política de envíos
            </Link>

            <Link href="/admin">
              Administración
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}