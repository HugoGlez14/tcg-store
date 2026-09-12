"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  SiteHeader,
} from "@/components/site-header";

import {
  SiteFooter,
} from "@/components/site-footer";

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

    marker:
      "01",

    tone:
      "home-pokemon",
  },

  {
    slug: "riftbound",
    name: "Riftbound",
    href: "/riftbound",

    detail:
      "Lanzamientos, preventas y cartas para tu mazo.",

    marker:
      "02",

    tone:
      "home-riftbound",
  },

  {
    slug: "yugioh",
    name: "Yu-Gi-Oh!",
    href: "/yugioh",

    detail:
      "Producto sellado, staples y coleccionables.",

    marker:
      "03",

    tone:
      "home-yugioh",
  },
];

const picks = [
  {
    name:
      "Destined Rivals",

    game:
      "Pokémon",

    href:
      "/pokemon",

    tag:
      "Nueva expansión",

    color:
      "pick-pokemon",
  },

  {
    name:
      "Spiritforged",

    game:
      "Riftbound",

    href:
      "/riftbound",

    tag:
      "Preventa",

    color:
      "pick-riftbound",
  },

  {
    name:
      "Alliance Insight",

    game:
      "Yu-Gi-Oh!",

    href:
      "/yugioh",

    tag:
      "Producto sellado",

    color:
      "pick-yugioh",
  },

  {
    name:
      "Colecciones premium",

    game:
      "Pokémon",

    href:
      "/pokemon",

    tag:
      "Para coleccionar",

    color:
      "pick-pokemon",
  },
];

const styles = `
.home-page {
  min-height: 100vh;

  background:
    #0b1020;
}

.home-intro {
  min-height:
    455px;

  padding:
    clamp(
      70px,
      8vw,
      120px
    )
    clamp(
      25px,
      7vw,
      118px
    )
    65px;

  background:
    radial-gradient(
      circle at 83% 18%,
      rgba(
        229,
        196,
        255,
        .95
      ),
      transparent 29%
    ),

    radial-gradient(
      circle at 12% 90%,
      rgba(
        184,
        233,
        255,
        .9
      ),
      transparent 31%
    ),

    linear-gradient(
      135deg,
      #eef0ff,
      #f7edf5
    );

  color:
    #0b1020;
}

.home-intro p {
  margin:
    0 0 22px;

  color:
    #667085;

  font-size:
    10px;

  font-weight:
    800;

  text-transform:
    uppercase;

  letter-spacing:
    .16em;
}

.home-intro h1 {
  margin: 0;

  font:
    700
    clamp(
      70px,
      10vw,
      150px
    )
    /
    .78
    Arial,
    Helvetica,
    sans-serif;

  letter-spacing:
    -.08em;
}

.home-intro i {
  color:
    #ff4764;

  font-style:
    italic;

  text-shadow:
    0
    3px
    0
    #ffd758;
}

.home-intro > span {
  display: block;

  max-width:
    600px;

  margin-top:
    34px;

  color:
    #576075;

  font-size:
    15px;

  line-height:
    1.6;
}


/* ========================
   TCG PRINCIPALES
======================== */

.game-links {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      1fr
    );

  gap: 16px;

  padding:
    clamp(
      42px,
      5vw,
      72px
    )
    clamp(
      20px,
      4vw,
      64px
    )
    clamp(
      60px,
      7vw,
      95px
    );

  background:
    radial-gradient(
      circle at 100% 0,
      rgba(
        69,
        230,
        214,
        .18
      ),
      transparent 28%
    ),

    linear-gradient(
      180deg,
      #11172c,
      #0c1223
    );
}

.game-link {
  min-height:
    410px;

  padding:
    21px;

  position: relative;

  overflow: hidden;

  display: flex;

  flex-direction:
    column;

  justify-content:
    space-between;

  isolation: isolate;

  border-radius:
    24px;

  color: #fff;

  box-shadow:
    0
    22px
    55px
    rgba(
      0,
      0,
      0,
      .24
    );
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

  object-position:
    center;
}

.game-link::after {
  content: "";

  position: absolute;

  inset: 0;

  z-index: -2;

  background:
    linear-gradient(
      180deg,
      rgba(
        5,
        8,
        18,
        .08
      ),

      rgba(
        5,
        8,
        18,
        .88
      )
    );
}

.game-shape {
  position:
    absolute;

  right: -16px;

  top: 57px;

  z-index: -1;

  width: 70%;

  aspect-ratio:
    .7;

  transform:
    rotate(13deg);

  border:
    2px solid
    rgba(
      255,
      255,
      255,
      .58
    );

  border-radius:
    7px;
}

.game-shape span {
  display: block;

  height: 1px;

  margin: 20%;

  background:
    rgba(
      255,
      255,
      255,
      .38
    );
}

.game-link-top {
  display: flex;

  justify-content:
    space-between;

  gap: 20px;

  font-size:
    11px;

  font-weight:
    700;
}

.game-link-top span {
  padding-bottom:
    4px;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      .7
    );
}

.game-card-logo {
  display: block;

  width:
    min(
      270px,
      76%
    );

  max-height:
    86px;

  margin-bottom:
    14px;

  object-fit:
    contain;

  object-position:
    left center;

  filter:
    drop-shadow(
      0
      8px
      16px
      rgba(
        0,
        0,
        0,
        .35
      )
    );
}

.game-link h2 {
  margin:
    0 0 14px;

  font:
    400
    clamp(
      42px,
      4vw,
      65px
    )
    /
    .9
    Georgia,
    serif;

  letter-spacing:
    -.055em;
}

.game-link p {
  max-width:
    290px;

  margin: 0;

  font-size:
    13px;

  line-height:
    1.45;
}


/* ========================
   CARRUSEL
======================== */

.home-carousel {
  padding:
    clamp(
      65px,
      8vw,
      115px
    )
    clamp(
      20px,
      7vw,
      112px
    );

  background:
    #11172a;

  color:
    #f6f7fb;
}

.carousel-heading {
  display: flex;

  align-items: end;

  justify-content:
    space-between;

  gap: 25px;

  margin-bottom:
    32px;
}

.carousel-heading p {
  margin:
    0 0 16px;

  color:
    #8f9ab5;

  font-size:
    10px;

  font-weight:
    700;

  text-transform:
    uppercase;

  letter-spacing:
    .15em;
}

.carousel-heading h2 {
  margin: 0;

  color: #fff;

  font:
    400
    clamp(
      45px,
      5vw,
      76px
    )
    /
    .88
    Georgia,
    serif;

  letter-spacing:
    -.06em;
}

.carousel-controls {
  display: flex;

  align-items:
    center;

  gap: 12px;

  font-size:
    12px;
}

.carousel-controls button {
  width: 39px;

  height: 39px;

  border:
    1px solid
    #66708c;

  border-radius:
    50%;

  background:
    transparent;

  color: #fff;

  font-size:
    18px;
}

.carousel-controls
button:hover {
  background:
    #fff;

  color:
    #0b1020;
}

.carousel-track {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      1fr
    );

  gap: 15px;
}

.pick-card {
  min-height:
    355px;

  padding:
    17px;

  display: flex;

  flex-direction:
    column;

  position: relative;

  overflow: hidden;

  border-radius:
    18px;

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
  height:
    205px;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      .55
    );

  background:
    rgba(
      255,
      255,
      255,
      .09
    );

  position:
    relative;

  display:
    grid;

  place-items:
    center;

  overflow:
    hidden;
}

.pick-art span {
  position:
    relative;

  z-index: 2;

  font-size:
    11px;

  text-transform:
    uppercase;

  letter-spacing:
    .11em;
}

.pick-art i {
  position:
    absolute;

  width: 42%;

  aspect-ratio:
    .7;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      .7
    );

  border-radius:
    5px;

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

.pick-art i + i {
  transform:
    rotate(-12deg)
    translate(
      -22px,
      20px
    );
}

.pick-card > p {
  margin:
    18px 0 8px;

  font-size:
    10px;

  text-transform:
    uppercase;

  letter-spacing:
    .12em;

  opacity: .78;
}

.pick-card h3 {
  margin: 0;

  font:
    400
    30px
    /
    .95
    Georgia,
    serif;

  letter-spacing:
    -.045em;
}

.pick-card footer {
  margin-top:
    auto;

  padding-top:
    13px;

  display: flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap: 15px;

  border-top:
    1px solid
    rgba(
      255,
      255,
      255,
      .36
    );

  font-size:
    12px;
}

.pick-card footer a {
  color: #fff;

  text-decoration:
    none;
}

@media(
  max-width:800px
) {
  .home-intro {
    min-height:
      390px;
  }

  .game-links,
  .carousel-track {
    grid-template-columns:
      1fr;
  }

  .game-link {
    min-height:
      320px;
  }

  .carousel-track
  .pick-card:nth-child(3) {
    display: none;
  }

  .carousel-heading {
    align-items:
      flex-start;

    flex-direction:
      column;
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
            storage_path:
              string;
          }[]
        | null
    ) => {
      const next:
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

        next[
          row.tcg as TcgSlug
        ] =
          data.publicUrl;
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
              .from(
                "tcg_logos"
              )
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
      <style>
        {styles}
      </style>

      <main className="home-page">
        <SiteHeader
          variant="light"
        />

        <section className="home-intro">
          <p>
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
                    Ir al
                    catálogo ↗
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
                      {
                        pick.game
                      }
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