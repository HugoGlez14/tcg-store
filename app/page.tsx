"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthButton } from "@/components/auth-button";
import { supabase } from "@/lib/supabase";

type TcgSlug =
  | "pokemon"
  | "riftbound"
  | "yugioh";

type CoverMap =
  Partial<Record<TcgSlug, string>>;

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
.home-carousel {
  padding:
    clamp(65px,8vw,115px)
    clamp(20px,7vw,112px);

  background:#eef0f4;
}

.carousel-heading {
  display:flex;
  align-items:end;
  justify-content:space-between;
  margin-bottom:32px;
}

.carousel-heading p {
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.15em;
  font-weight:700;
  color:#66718a;
  margin:0 0 16px;
}

.carousel-heading h2 {
  font:
    400 clamp(45px,5vw,76px)/.88
    Georgia,
    serif;

  letter-spacing:-.06em;
  margin:0;
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
  border:1px solid #aeb7c7;

  background:transparent;

  font-size:18px;
}

.carousel-controls button:hover {
  background:#0b1020;
  color:white;
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

  text-transform:uppercase;
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
    translate(36px,22px);

  background:
    rgba(255,255,255,.12);
}

.pick-art i+i {
  transform:
    rotate(-12deg)
    translate(-22px,20px);
}

.pick-card>p {
  font-size:10px;

  text-transform:uppercase;
  letter-spacing:.12em;

  opacity:.78;

  margin:18px 0 8px;
}

.pick-card h3 {
  font:
    400 30px/.95
    Georgia,
    serif;

  letter-spacing:-.045em;

  margin:0;
}

.pick-card footer {
  margin-top:auto;

  border-top:
    1px solid
    rgba(255,255,255,.36);

  padding-top:13px;

  display:flex;
  align-items:center;
  justify-content:space-between;

  font-size:12px;
}

.pick-card footer button {
  border:0;
  background:transparent;
  color:white;
  font-size:12px;
  padding:0;
}

.admin-access {
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:9px 14px;

  border:
    1px solid
    rgba(11,16,32,.18);

  border-radius:100px;

  font-size:13px;

  text-decoration:none;

  transition:
    background .2s ease,
    color .2s ease;
}

.admin-access:hover {
  background:#0b1020;
  color:white;
}

.game-link.has-cover {
  background-size:cover;
  background-position:center;
  background-repeat:no-repeat;
}

.store-footer a {
  text-decoration:none;
}

.store-footer a:hover {
  color:#5e61e8;
}

@media(max-width:800px) {

  .carousel-track {
    grid-template-columns:1fr;
  }

  .carousel-track
  .pick-card:nth-child(3) {
    display:none;
  }

  .carousel-heading {
    align-items:flex-start;
    flex-direction:column;
    gap:22px;
  }

  .admin-access {
    font-size:11px;
    padding:8px 10px;
  }
}
`;

export default function Home() {
  const [start, setStart] =
    useState(0);

  const [intro, setIntro] =
    useState("");

  const [
    homeCovers,
    setHomeCovers,
  ] = useState<CoverMap>({});

  /*
   * Texto opcional de bienvenida.
   */
  useEffect(() => {
    setIntro(
      localStorage.getItem(
        "tcg-home-intro"
      ) || ""
    );
  }, []);

  /*
   * Cargar portadas de la página
   * principal desde Supabase.
   */
  useEffect(() => {
    if (!supabase) return;

    const client = supabase;

    const loadCovers = async () => {
      const {
        data,
        error,
      } = await client
        .from("home_covers")
        .select(
          "tcg,storage_path"
        );

      if (error) {
        console.error(
          "Error cargando portadas de inicio:",
          error
        );

        return;
      }

      const next: CoverMap = {};

      for (const cover of data ?? []) {
        const tcg =
          cover.tcg as TcgSlug;

        if (
          ![
            "pokemon",
            "riftbound",
            "yugioh",
          ].includes(tcg)
        ) {
          continue;
        }

        const {
          data: publicData,
        } = client.storage
          .from("catalog-images")
          .getPublicUrl(
            cover.storage_path
          );

        next[tcg] =
          publicData.publicUrl;
      }

      setHomeCovers(next);
    };

    loadCovers();
  }, []);

  /*
   * Carrusel inferior.
   */
  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setStart(
          (current) =>
            (current + 1) %
            picks.length
        );
      }, 4500);

    return () =>
      window.clearInterval(timer);
  }, []);

  const visible = [0, 1, 2].map(
    (offset) =>
      picks[
        (start + offset) %
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
            <span>TCG STORE</span>
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
              Carrito <b>0</b>
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

            <i>universo.</i>
          </h1>

          {intro && (
            <span>{intro}</span>
          )}
        </section>

        <section className="game-links">
          {games.map((game) => {
            const cover =
              homeCovers[
                game.slug
              ];

            return (
              <Link
                className={`game-link ${game.tone} ${
                  cover
                    ? "has-cover"
                    : ""
                }`}
                href={game.href}
                key={game.name}
                style={
                  cover
                    ? {
                        backgroundImage: `
                          linear-gradient(
                            180deg,
                            rgba(5,8,20,.10),
                            rgba(5,8,20,.72)
                          ),
                          url("${cover}")
                        `,
                        backgroundSize:
                          "cover",
                        backgroundPosition:
                          "center",
                      }
                    : undefined
                }
              >
                {!cover && (
                  <div className="game-shape">
                    <span />
                    <span />
                    <span />
                  </div>
                )}

                <div className="game-link-top">
                  <b>
                    {game.marker}
                  </b>

                  <span>
                    Ir al catálogo ↗
                  </span>
                </div>

                <div>
                  <h2>
                    {game.name}
                  </h2>

                  <p>
                    {game.detail}
                  </p>
                </div>
              </Link>
            );
          })}
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
                aria-label="Producto anterior"
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
                / 0
                {picks.length}
              </span>

              <button
                type="button"
                aria-label="Producto siguiente"
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
              (pick, index) => (
                <article
                  className={`pick-card ${pick.color}`}
                  key={`${pick.name}-${index}`}
                >
                  <div className="pick-art">
                    <span>
                      Imagen de producto
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

                    <button
                      type="button"
                    >
                      Ver producto ↗
                    </button>
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
            <span>TCG STORE</span>
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