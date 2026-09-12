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
      "Expansiones, producto sellado, cartas individuales y accesorios.",

    marker: "01",

    tone:
      "home-pokemon",
  },

  {
    slug: "riftbound",
    name: "Riftbound",
    href: "/riftbound",

    detail:
      "Lanzamientos, preventas y cartas para construir tu siguiente mazo.",

    marker: "02",

    tone:
      "home-riftbound",
  },

  {
    slug: "yugioh",
    name: "Yu-Gi-Oh!",
    href: "/yugioh",

    detail:
      "Producto sellado, staples, coleccionables y cartas para duelo.",

    marker: "03",

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

/* =========================================
   PÁGINA PRINCIPAL
========================================= */

.home-page {
  min-height: 100vh;

  background:
    #0b1020;

  overflow-x: hidden;
}


/* =========================================
   HERO
========================================= */

.home-intro {
  position: relative;

  min-height:
    clamp(
      540px,
      70vh,
      690px
    );

  display: grid;

  grid-template-columns:
    minmax(0, 1.1fr)
    minmax(390px, .9fr);

  align-items: center;

  gap:
    clamp(
      45px,
      7vw,
      110px
    );

  padding:
    clamp(
      70px,
      8vw,
      115px
    )
    clamp(
      28px,
      7vw,
      118px
    );

  overflow: hidden;

  background:
    radial-gradient(
      circle at 8% 88%,
      rgba(
        99,
        205,
        255,
        .36
      ),
      transparent 32%
    ),

    radial-gradient(
      circle at 88% 18%,
      rgba(
        234,
        160,
        255,
        .34
      ),
      transparent 34%
    ),

    linear-gradient(
      135deg,
      #eef3ff 0%,
      #f4f0ff 46%,
      #fff0f4 100%
    );

  color:
    #0b1020;
}

.home-intro::before {
  content: "";

  position: absolute;

  inset: 0;

  background-image:
    linear-gradient(
      rgba(
        11,
        16,
        32,
        .028
      )
      1px,
      transparent
      1px
    ),

    linear-gradient(
      90deg,
      rgba(
        11,
        16,
        32,
        .028
      )
      1px,
      transparent
      1px
    );

  background-size:
    54px 54px;

  pointer-events:
    none;
}

.home-intro-copy {
  position: relative;

  z-index: 2;
}

.home-kicker {
  display:
    inline-flex;

  align-items:
    center;

  gap: 10px;

  margin:
    0 0 25px;

  color:
    #626d83;

  font-size:
    10px;

  font-weight:
    800;

  text-transform:
    uppercase;

  letter-spacing:
    .17em;
}

.home-kicker::before {
  content: "";

  width: 31px;

  height: 1px;

  background:
    #626d83;
}

.home-intro h1 {
  max-width:
    760px;

  margin: 0;

  font:
    750
    clamp(
      70px,
      8.8vw,
      145px
    )
    /
    .78
    Arial,
    Helvetica,
    sans-serif;

  letter-spacing:
    -.085em;
}

.home-intro h1 i {
  display:
    inline-block;

  color:
    #ff4764;

  font-style:
    italic;

  text-shadow:
    0
    4px
    0
    #ffd758;
}

.home-intro-message {
  max-width:
    550px;

  margin:
    34px 0 0;

  color:
    #555f75;

  font-size:
    15px;

  line-height:
    1.65;
}

.hero-actions {
  display: flex;

  align-items:
    center;

  flex-wrap:
    wrap;

  gap: 13px;

  margin-top:
    34px;
}

.hero-primary {
  display:
    inline-flex;

  align-items:
    center;

  gap: 26px;

  min-height:
    47px;

  padding:
    0 19px;

  border-radius:
    100px;

  background:
    #0b1020;

  color:
    #fff;

  text-decoration:
    none;

  font-size:
    13px;

  font-weight:
    700;

  transition:
    transform .2s ease,
    background .2s ease;
}

.hero-primary:hover {
  transform:
    translateY(-2px);

  background:
    #242d4c;
}

.hero-secondary {
  display:
    inline-flex;

  align-items:
    center;

  min-height:
    47px;

  padding:
    0 17px;

  border:
    1px solid
    rgba(
      11,
      16,
      32,
      .16
    );

  border-radius:
    100px;

  color:
    #0b1020;

  text-decoration:
    none;

  font-size:
    13px;
}


/* =========================================
   PANEL DERECHO HERO
========================================= */

.hero-showcase {
  position: relative;

  z-index: 2;

  min-height:
    420px;

  padding:
    clamp(
      24px,
      3vw,
      38px
    );

  display: flex;

  flex-direction:
    column;

  justify-content:
    space-between;

  overflow: hidden;

  border:
    1px solid
    rgba(
      11,
      16,
      32,
      .09
    );

  border-radius:
    34px;

  background:
    rgba(
      255,
      255,
      255,
      .52
    );

  box-shadow:
    0
    35px
    90px
    rgba(
      43,
      50,
      88,
      .13
    );

  backdrop-filter:
    blur(18px);
}

.hero-showcase::before {
  content: "";

  position: absolute;

  width: 300px;

  height: 300px;

  right: -100px;

  top: -100px;

  border-radius:
    50%;

  background:
    rgba(
      120,
      103,
      242,
      .19
    );

  filter:
    blur(30px);
}

.showcase-heading {
  position: relative;

  z-index: 2;
}

.showcase-heading small {
  display: block;

  margin-bottom:
    12px;

  color:
    #757f94;

  font-size:
    9px;

  font-weight:
    800;

  letter-spacing:
    .17em;

  text-transform:
    uppercase;
}

.showcase-heading h2 {
  max-width:
    400px;

  margin: 0;

  font:
    400
    clamp(
      31px,
      3vw,
      48px
    )
    /
    .98
    Georgia,
    serif;

  letter-spacing:
    -.045em;
}

.hero-universes {
  position: relative;

  z-index: 2;

  display: grid;

  gap: 10px;

  margin:
    32px 0;
}

.hero-universe {
  min-height:
    66px;

  padding:
    10px 15px;

  display: grid;

  grid-template-columns:
    44px
    1fr
    auto;

  align-items:
    center;

  gap: 14px;

  border:
    1px solid
    rgba(
      11,
      16,
      32,
      .08
    );

  border-radius:
    15px;

  background:
    rgba(
      255,
      255,
      255,
      .66
    );

  color:
    #0b1020;

  text-decoration:
    none;

  transition:
    transform .2s ease,
    background .2s ease;
}

.hero-universe:hover {
  transform:
    translateX(5px);

  background:
    rgba(
      255,
      255,
      255,
      .93
    );
}

.universe-number {
  width: 38px;

  height: 38px;

  display: grid;

  place-items:
    center;

  border-radius:
    50%;

  background:
    #0b1020;

  color:
    #fff;

  font:
    12px
    Georgia,
    serif;
}

.hero-universe-logo {
  display: block;

  width:
    min(
      130px,
      100%
    );

  height: 35px;

  object-fit:
    contain;

  object-position:
    left center;
}

.universe-fallback {
  font-size:
    14px;

  font-weight:
    800;
}

.hero-universe > b {
  color:
    #747e92;

  font-size:
    17px;
}

.showcase-footer {
  position: relative;

  z-index: 2;

  display: grid;

  grid-template-columns:
    repeat(
      3,
      1fr
    );

  gap: 8px;
}

.showcase-footer div {
  padding:
    13px 10px;

  border-radius:
    13px;

  background:
    rgba(
      11,
      16,
      32,
      .06
    );
}

.showcase-footer b {
  display: block;

  margin-bottom:
    3px;

  font-size:
    12px;
}

.showcase-footer span {
  color:
    #737d92;

  font-size:
    9px;
}


/* =========================================
   DIVISOR ENTRE HERO Y CATÁLOGOS
========================================= */

.home-transition {
  padding:
    20px
    clamp(
      20px,
      4vw,
      64px
    );

  display: flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap: 20px;

  background:
    #0c1223;

  color:
    #8f99ae;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      .07
    );

  font-size:
    10px;

  font-weight:
    700;

  text-transform:
    uppercase;

  letter-spacing:
    .13em;
}

.home-transition span:last-child {
  color:
    #72e1d6;
}


/* =========================================
   TARJETAS PRINCIPALES
========================================= */

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
      38px,
      5vw,
      66px
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
        .15
      ),
      transparent 28%
    ),

    radial-gradient(
      circle at 0 100%,
      rgba(
        113,
        89,
        231,
        .14
      ),
      transparent 30%
    ),

    linear-gradient(
      180deg,
      #11172c,
      #0c1223
    );
}

.game-link {
  min-height:
    390px;

  padding:
    21px;

  position:
    relative;

  overflow:
    hidden;

  display:
    flex;

  flex-direction:
    column;

  justify-content:
    space-between;

  isolation:
    isolate;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      .09
    );

  border-radius:
    24px;

  color:
    #fff;

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

  transition:
    transform .25s ease,
    box-shadow .25s ease;
}

.game-link:hover {
  transform:
    translateY(-7px);

  box-shadow:
    0
    35px
    70px
    rgba(
      0,
      0,
      0,
      .32
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

  transition:
    transform .4s ease;
}

.game-link:hover
.game-card-cover {
  transform:
    scale(1.045);
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
      )
      0%,

      rgba(
        5,
        8,
        18,
        .26
      )
      40%,

      rgba(
        5,
        8,
        18,
        .92
      )
      100%
    );
}

.game-shape {
  position:
    absolute;

  right:
    -16px;

  top:
    57px;

  z-index:
    -1;

  width:
    70%;

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
  display:
    block;

  height:
    1px;

  margin:
    20%;

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

  gap:
    20px;

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
  display:
    block;

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
    300px;

  margin: 0;

  color:
    rgba(
      255,
      255,
      255,
      .88
    );

  font-size:
    13px;

  line-height:
    1.48;
}


/* =========================================
   CARRUSEL
========================================= */

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
  display:
    flex;

  align-items:
    end;

  justify-content:
    space-between;

  gap:
    25px;

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

  color:
    #fff;

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
  display:
    flex;

  align-items:
    center;

  gap:
    12px;

  font-size:
    12px;
}

.carousel-controls button {
  width:
    39px;

  height:
    39px;

  border:
    1px solid
    #66708c;

  border-radius:
    50%;

  background:
    transparent;

  color:
    #fff;

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
  display:
    grid;

  grid-template-columns:
    repeat(
      3,
      1fr
    );

  gap:
    15px;
}

.pick-card {
  min-height:
    355px;

  padding:
    17px;

  display:
    flex;

  flex-direction:
    column;

  position:
    relative;

  overflow:
    hidden;

  border-radius:
    18px;

  color:
    #fff;
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

  z-index:
    2;

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

  width:
    42%;

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

  opacity:
    .78;
}

.pick-card h3 {
  margin:
    0;

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

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    15px;

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
  color:
    #fff;

  text-decoration:
    none;
}


/* =========================================
   RESPONSIVE
========================================= */

@media(
  max-width: 1050px
) {
  .home-intro {
    grid-template-columns:
      1fr;

    min-height:
      auto;
  }

  .hero-showcase {
    min-height:
      auto;
  }
}

@media(
  max-width: 850px
) {
  .game-links,
  .carousel-track {
    grid-template-columns:
      1fr;
  }

  .game-link {
    min-height:
      330px;
  }

  .carousel-track
  .pick-card:nth-child(3) {
    display:
      none;
  }

  .carousel-heading {
    align-items:
      flex-start;

    flex-direction:
      column;
  }
}

@media(
  max-width: 600px
) {
  .home-intro {
    padding:
      60px
      20px;
  }

  .home-intro h1 {
    font-size:
      69px;
  }

  .hero-showcase {
    padding:
      22px;

    border-radius:
      24px;
  }

  .showcase-footer {
    grid-template-columns:
      1fr;
  }

  .home-transition {
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
            tcg:
              string;

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
              (
                current +
                1
              ) %
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
          (
            start +
            offset
          ) %
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

        {/* =================================
            HERO
        ================================= */}

        <section className="home-intro">
          <div className="home-intro-copy">
            <p className="home-kicker">
              Cartas
              coleccionables
              · México
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
                "Encuentra cartas, expansiones y coleccionables de tus TCG favoritos en un solo lugar."}
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
                Ver Pokémon
                ↗
              </Link>
            </div>
          </div>

          <aside className="hero-showcase">
            <div className="showcase-heading">
              <small>
                POKEAMIGOS
              </small>

              <h2>
                Tres juegos.
                <br />
                Una sola
                colección.
              </h2>
            </div>

            <div className="hero-universes">
              {games.map(
                (
                  game,
                  index
                ) => (
                  <Link
                    className="hero-universe"
                    href={
                      game.href
                    }
                    key={
                      game.slug
                    }
                  >
                    <span className="universe-number">
                      {String(
                        index +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {logos[
                      game.slug
                    ] ? (
                      <img
                        className="hero-universe-logo"
                        src={
                          logos[
                            game
                              .slug
                          ]
                        }
                        alt={`Logo ${game.name}`}
                      />
                    ) : (
                      <span className="universe-fallback">
                        {
                          game.name
                        }
                      </span>
                    )}

                    <b>
                      ↗
                    </b>
                  </Link>
                )
              )}
            </div>

            <div className="showcase-footer">
              <div>
                <b>
                  Colecciona
                </b>

                <span>
                  Tus cartas
                  favoritas
                </span>
              </div>

              <div>
                <b>
                  Construye
                </b>

                <span>
                  Tu siguiente
                  mazo
                </span>
              </div>

              <div>
                <b>
                  Descubre
                </b>

                <span>
                  Nuevos
                  lanzamientos
                </span>
              </div>
            </div>
          </aside>
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

        {/* =================================
            TCG
        ================================= */}

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

        {/* =================================
            DESTACADOS
        ================================= */}

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
                    (
                      start +
                      1
                    ) %
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
                    {
                      pick.tag
                    }
                  </p>

                  <h3>
                    {
                      pick.name
                    }
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
                      Ver
                      catálogo ↗
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