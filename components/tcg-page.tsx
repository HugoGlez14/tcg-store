"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthButton } from "@/components/auth-button";

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

const tcgStyles = `
.theme-pokemon .store-hero{
  background:
    radial-gradient(circle at 82% 25%,#ffd139 0 8%,transparent 9%),
    linear-gradient(125deg,#e83632,#ee6244 58%,#f2ba25)
}

.theme-pokemon .product-meta button{
  background:#e83836
}

.theme-riftbound .store-hero{
  background:
    radial-gradient(circle at 80% 26%,#79e3ff 0 5%,transparent 6%),
    linear-gradient(125deg,#1f144f,#6242bd 56%,#5bd1ef)
}

.theme-riftbound .product-meta button{
  background:#5c49cf
}

.theme-yugioh .store-hero{
  background:
    radial-gradient(circle at 79% 25%,#e4b849 0 5%,transparent 6%),
    linear-gradient(125deg,#15080b,#63202a 56%,#c75135)
}

.theme-yugioh .product-meta button{
  background:#98372d
}
`;

export function TcgPage({
  config,
}: {
  config: StoreConfig;
}) {
  const [cart, setCart] = useState(0);
  const [notice, setNotice] = useState("");
  const [cover, setCover] = useState("");

  useEffect(() => {
    setCover(localStorage.getItem(`tcg-cover-${config.slug}`) || "");
  }, [config.slug]);

  const add = (product: string) => {
    setCart((value) => value + 1);

    setNotice(`${product} añadido al carrito`);

    setTimeout(() => {
      setNotice("");
    }, 2200);
  };

  const heroStyle = cover
    ? {
        backgroundImage: `linear-gradient(
          100deg,
          rgba(8,10,20,.82),
          rgba(8,10,20,.25)
        ),url(${cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <>
      <style>{tcgStyles}</style>

      <main className={`store-page ${config.accent}`}>
        <header className="shop-header">
          <Link className="wordmark" href="/">
            [ ] <span>TCG STORE</span>
          </Link>

          <nav>
            <Link href="/pokemon">Pokémon</Link>
            <Link href="/riftbound">Riftbound</Link>
            <Link href="/yugioh">Yu-Gi-Oh!</Link>
          </nav>

          <div className="header-actions">
            <AuthButton />

            <button className="bag">
              Carrito <b>{cart}</b>
            </button>
          </div>
        </header>

        <section className="store-hero" style={heroStyle}>
          <div className="hero-grid" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="store-hero-copy">
            <p>Catálogo independiente</p>

            <h1>{config.name}</h1>

            <p className="store-subtitle">{config.subtitle}</p>

            <a href="#catalogo">
              Explorar catálogo <span>↓</span>
            </a>
          </div>

          <div className="admin-image-note">
            <strong>Portada de categoría</strong>

            <small>
              {cover
                ? "Portada cargada desde administración"
                : "La cargarás desde administración"}
            </small>
          </div>
        </section>

        <section id="catalogo" className="catalog-wrap">
          <div className="catalog-top">
            <div>
              <p>Explora {config.name}</p>
              <h2>Compra por categoría.</h2>
            </div>

            <button className="filter-button">
              Filtros <span>⌄</span>
            </button>
          </div>

          <nav className="category-nav">
            {config.sections.map((section) => (
              <a
                href={`#${section.title
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
                key={section.title}
              >
                {section.title}
              </a>
            ))}
          </nav>

          {config.sections.map((section, sectionIndex) => (
            <section
              key={section.title}
              id={section.title.toLowerCase().replaceAll(" ", "-")}
              className="product-section"
            >
              <div className="product-section-title">
                <span>0{sectionIndex + 1}</span>

                <h3>{section.title}</h3>

                <a href="#catalogo">
                  Ver todo <b>↗</b>
                </a>
              </div>

              <div className="product-grid">
                {section.products.map((product, index) => (
                  <article className="product-card" key={product}>
                    <div className="product-image">
                      <div
                        className={`image-loader loader-${config.slug}`}
                        aria-label={`Cargando espacio de imagen de ${config.name}`}
                      >
                        <i />
                        <i />
                        <i />
                      </div>

                      <span>Imagen de producto</span>

                      <small>
                        Se carga desde administración
                      </small>

                      <b>0{index + 1}</b>
                    </div>

                    <div className="product-meta">
                      <p>{section.title}</p>

                      <h4>{product}</h4>

                      <div>
                        <strong>
                          {index === 0
                            ? "Próximamente"
                            : "Consultar precio"}
                        </strong>

                        <button
                          onClick={() => add(product)}
                          aria-label={`Añadir ${product}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </section>

        <footer className="store-footer">
          <div className="wordmark">
            [ ] <span>TCG STORE</span>
          </div>

          <p>Nombre e identidad visual por definir.</p>

          <div>
            <a href="#">Política de privacidad</a>
            <a href="#">Términos y condiciones</a>
            <a href="#">Política de envíos</a>
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