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

export type StoreConfig = {
  slug: string;
  name: string;
  accent: string;
  subtitle: string;

  sections: {
    title: string;
    products: string[];
  }[];
};

const styles = `
.store-page {
  --accent: #6f6bea;
  --accent-soft: #9e9aff;

  min-height: 100vh;

  background: #0b1020;

  color: #f6f7fb;
}

.store-page.theme-pokemon {
  --accent: #ff4d4d;
  --accent-soft: #ffbd4a;
}

.store-page.theme-riftbound {
  --accent: #735ee8;
  --accent-soft: #69d8ff;
}

.store-page.theme-yugioh {
  --accent: #c64c3e;
  --accent-soft: #e2b54d;
}

.store-page .shop-header {
  background:
    rgba(10, 14, 27, .96);

  color: #f6f7fb;

  border-bottom:
    1px solid
    rgba(255,255,255,.08);

  backdrop-filter:
    blur(14px);
}

.store-page .shop-header a {
  color: inherit;
}

.store-page .account {
  color: #f6f7fb;
}

.store-page .admin-access {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  padding: 9px 14px;

  border:
    1px solid
    rgba(255,255,255,.18);

  border-radius: 100px;

  color: #f6f7fb;

  font-size: 13px;

  text-decoration: none;
}

.store-page .admin-access:hover {
  background: #f6f7fb;
  color: #0b1020;
}

.store-page .bag {
  background: #f6f7fb;
  color: #0b1020;
}

.store-page .store-hero {
  min-height:
    clamp(
      540px,
      65vh,
      690px
    );

  display: grid;

  grid-template-columns:
    minmax(320px,.85fr)
    minmax(430px,1.15fr);

  align-items: center;

  gap:
    clamp(
      35px,
      6vw,
      100px
    );

  padding:
    clamp(70px,8vw,120px)
    clamp(25px,6vw,105px);

  background:
    radial-gradient(
      circle at 85% 20%,
      color-mix(
        in srgb,
        var(--accent) 28%,
        transparent
      ),
      transparent 34%
    ),
    radial-gradient(
      circle at 15% 85%,
      color-mix(
        in srgb,
        var(--accent-soft) 13%,
        transparent
      ),
      transparent 32%
    ),
    linear-gradient(
      135deg,
      #0a0f1f,
      #10172d
    );

  position: relative;

  overflow: hidden;
}

.store-page .store-hero::before {
  content: "";

  position: absolute;

  inset: 0;

  background-image:
    linear-gradient(
      rgba(255,255,255,.025)
      1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,.025)
      1px,
      transparent 1px
    );

  background-size:
    55px 55px;

  pointer-events: none;
}

.store-hero-copy {
  position: relative;
  z-index: 2;
}

.store-hero-copy > p:first-child {
  margin: 0 0 24px;

  color:
    var(--accent-soft);

  font-size: 10px;

  font-weight: 800;

  letter-spacing: .17em;

  text-transform: uppercase;
}

.store-hero-copy h1 {
  margin: 0;

  color: #fff;

  font:
    700 clamp(65px,8vw,130px)/.82
    Arial,
    Helvetica,
    sans-serif;

  letter-spacing:
    -.07em;
}

.tcg-hero-logo {
  display: block;

  width: min(
    520px,
    90%
  );

  max-height: 175px;

  object-fit: contain;

  object-position:
    left center;

  margin:
    0 0 30px;
}

.store-subtitle {
  max-width: 540px;

  margin:
    25px 0 30px;

  color: #c5cada;

  font-size: 16px;

  line-height: 1.6;
}

.store-hero-copy > a {
  display: inline-flex;

  align-items: center;

  gap: 25px;

  padding:
    14px 20px;

  border-radius: 100px;

  background: #fff;

  color: #0b1020;

  text-decoration: none;

  font-size: 14px;

  font-weight: 700;
}

.store-hero-copy > a:hover {
  background:
    var(--accent-soft);
}

.store-hero-media {
  position: relative;

  z-index: 2;

  width: 100%;

  height:
    clamp(
      320px,
      34vw,
      470px
    );

  border:
    1px solid
    rgba(255,255,255,.12);

  border-radius: 32px;

  background:
    rgba(4,8,18,.72);

  box-shadow:
    0 35px 90px
    rgba(0,0,0,.38);

  padding:
    clamp(
      18px,
      3vw,
      34px
    );

  display: grid;

  place-items: center;

  overflow: hidden;
}

.store-hero-media::before {
  content: "";

  position: absolute;

  width: 55%;

  aspect-ratio: 1;

  border-radius: 50%;

  background:
    var(--accent);

  filter:
    blur(110px);

  opacity: .16;
}

.store-cover-image {
  position: relative;

  z-index: 1;

  width: 100%;
  height: 100%;

  object-fit: contain;

  object-position: center;

  display: block;
}

.store-cover-placeholder {
  width: 100%;
  height: 100%;

  display: grid;

  place-items: center;

  border:
    1px dashed
    rgba(255,255,255,.18);

  border-radius: 22px;

  color:
    rgba(255,255,255,.45);

  text-transform: uppercase;

  font-size: 10px;

  letter-spacing: .15em;
}

.store-page .catalog-wrap {
  background:
    radial-gradient(
      circle at 90% 0%,
      rgba(111,107,234,.12),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #10162a,
      #0c1223
    );

  color: #f5f7ff;

  padding-top:
    clamp(
      70px,
      8vw,
      120px
    );
}

.store-page .catalog-top p {
  color:
    var(--accent-soft);
}

.store-page .catalog-top h2 {
  color: #fff;
}

.store-page .filter-button {
  background:
    rgba(255,255,255,.07);

  color: #fff;

  border:
    1px solid
    rgba(255,255,255,.14);
}

.store-page .category-nav {
  border-color:
    rgba(255,255,255,.1);
}

.store-page .category-nav a {
  color: #cfd4e3;
}

.store-page .category-nav a:hover {
  color:
    var(--accent-soft);
}

.store-page .product-section {
  border-color:
    rgba(255,255,255,.09);
}

.store-page .product-section-title {
  color: #fff;
}

.store-page .product-section-title span {
  color:
    var(--accent-soft);
}

.store-page .product-section-title a {
  color: #bfc5d6;
}

.store-page .product-card {
  background: #161d32;

  border:
    1px solid
    rgba(255,255,255,.08);

  box-shadow:
    0 18px 40px
    rgba(0,0,0,.16);
}

.store-page .product-image {
  background:
    linear-gradient(
      145deg,
      #10162a,
      #1c2541
    );

  color: #c9cede;
}

.store-page .product-meta {
  color: #fff;
}

.store-page .product-meta p {
  color:
    var(--accent-soft);
}

.store-page .product-meta strong {
  color: #d9deeb;
}

.store-page .store-footer {
  background: #080d1a;
  color: #d8dce8;

  border-top:
    1px solid
    rgba(255,255,255,.08);
}

.store-page .store-footer a {
  color: #bfc5d4;
  text-decoration: none;
}

.store-page .store-footer a:hover {
  color:
    var(--accent-soft);
}

@media(max-width:1000px) {
  .store-page .store-hero {
    grid-template-columns: 1fr;

    min-height: auto;

    padding-top: 80px;
  }

  .store-hero-media {
    height:
      clamp(
        300px,
        60vw,
        450px
      );
  }
}

@media(max-width:600px) {
  .store-page .store-hero {
    padding:
      60px 20px;
  }

  .store-hero-copy h1 {
    font-size: 65px;
  }

  .tcg-hero-logo {
    max-height: 120px;
  }

  .store-hero-media {
    height: 280px;

    border-radius: 22px;

    padding: 14px;
  }
}
`;

export function TcgPage({
  config,
}: {
  config: StoreConfig;
}) {
  const [
    cart,
    setCart,
  ] = useState(0);

  const [
    notice,
    setNotice,
  ] = useState("");

  const [
    cover,
    setCover,
  ] = useState("");

  const [
    logo,
    setLogo,
  ] = useState("");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;

    const loadMedia =
      async () => {
        const [
          coverResult,
          logoResult,
        ] =
          await Promise.all([
            client
              .from(
                "catalog_covers"
              )
              .select(
                "storage_path"
              )
              .eq(
                "tcg",
                config.slug
              )
              .maybeSingle(),

            client
              .from(
                "tcg_logos"
              )
              .select(
                "storage_path"
              )
              .eq(
                "tcg",
                config.slug
              )
              .maybeSingle(),
          ]);

        if (
          coverResult
            .data
            ?.storage_path
        ) {
          const {
            data,
          } =
            client.storage
              .from(
                "catalog-images"
              )
              .getPublicUrl(
                coverResult
                  .data
                  .storage_path
              );

          setCover(
            data.publicUrl
          );
        } else {
          setCover("");
        }

        if (
          logoResult
            .data
            ?.storage_path
        ) {
          const {
            data,
          } =
            client.storage
              .from(
                "catalog-images"
              )
              .getPublicUrl(
                logoResult
                  .data
                  .storage_path
              );

          setLogo(
            data.publicUrl
          );
        } else {
          setLogo("");
        }
      };

    loadMedia();
  }, [config.slug]);

  const add = (
    product: string
  ) => {
    setCart(
      (current) =>
        current + 1
    );

    setNotice(
      `${product} añadido al carrito`
    );

    setTimeout(() => {
      setNotice("");
    }, 2200);
  };

  return (
    <>
      <style>{styles}</style>

      <main
        className={`store-page ${config.accent}`}
      >
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
              <b>{cart}</b>
            </button>
          </div>
        </header>

        <section className="store-hero">
          <div className="store-hero-copy">
            <p>
              Catálogo independiente
            </p>

            {logo ? (
              <img
                className="tcg-hero-logo"
                src={logo}
                alt={`Logo ${config.name}`}
              />
            ) : (
              <h1>
                {config.name}
              </h1>
            )}

            <p className="store-subtitle">
              {config.subtitle}
            </p>

            <a href="#catalogo">
              Explorar catálogo{" "}
              <span>↓</span>
            </a>
          </div>

          <div className="store-hero-media">
            {cover ? (
              <img
                className="store-cover-image"
                src={cover}
                alt={`Portada ${config.name}`}
              />
            ) : (
              <div className="store-cover-placeholder">
                Portada de{" "}
                {config.name}
              </div>
            )}
          </div>
        </section>

        <section
          id="catalogo"
          className="catalog-wrap"
        >
          <div className="catalog-top">
            <div>
              <p>
                Explora{" "}
                {config.name}
              </p>

              <h2>
                Compra por
                categoría.
              </h2>
            </div>

            <button
              className="filter-button"
              type="button"
            >
              Filtros{" "}
              <span>⌄</span>
            </button>
          </div>

          <nav className="category-nav">
            {config.sections.map(
              (section) => (
                <a
                  href={`#${section.title
                    .toLowerCase()
                    .replaceAll(
                      " ",
                      "-"
                    )}`}
                  key={
                    section.title
                  }
                >
                  {
                    section.title
                  }
                </a>
              )
            )}
          </nav>

          {config.sections.map(
            (
              section,
              sectionIndex
            ) => (
              <section
                key={
                  section.title
                }
                id={section.title
                  .toLowerCase()
                  .replaceAll(
                    " ",
                    "-"
                  )}
                className="product-section"
              >
                <div className="product-section-title">
                  <span>
                    {String(
                      sectionIndex +
                        1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <h3>
                    {
                      section.title
                    }
                  </h3>

                  <a href="#catalogo">
                    Ver todo{" "}
                    <b>↗</b>
                  </a>
                </div>

                <div className="product-grid">
                  {section.products.map(
                    (
                      product,
                      index
                    ) => (
                      <article
                        className="product-card"
                        key={
                          product
                        }
                      >
                        <div className="product-image">
                          <div
                            className={`image-loader loader-${config.slug}`}
                          >
                            <i />
                            <i />
                            <i />
                          </div>

                          <span>
                            Imagen de
                            producto
                          </span>

                          <small>
                            Se carga
                            desde
                            administración
                          </small>

                          <b>
                            {String(
                              index +
                                1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </b>
                        </div>

                        <div className="product-meta">
                          <p>
                            {
                              section.title
                            }
                          </p>

                          <h4>
                            {
                              product
                            }
                          </h4>

                          <div>
                            <strong>
                              {index ===
                              0
                                ? "Próximamente"
                                : "Consultar precio"}
                            </strong>

                            <button
                              type="button"
                              onClick={() =>
                                add(
                                  product
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              </section>
            )
          )}
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

        {notice && (
          <output className="toast">
            {notice}
          </output>
        )}
      </main>
    </>
  );
}