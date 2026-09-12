"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  SiteHeader,
} from "@/components/site-header";

import {
  SiteFooter,
} from "@/components/site-footer";

import {
  useCart,
} from "@/components/cart-provider";

import {
  supabase,
} from "@/lib/supabase";

export type StoreConfig = {
  slug:
    | "pokemon"
    | "riftbound"
    | "yugioh";

  name: string;

  accent: string;

  subtitle: string;

  sections: {
    title: string;
    products: string[];
  }[];
};

type DbProduct = {
  id: string;

  tcg:
    | "pokemon"
    | "riftbound"
    | "yugioh";

  name: string;

  category: string;

  description:
    | string
    | null;

  price_mxn:
    | number
    | string;

  stock: number;
};

type DisplayProduct = {
  id: string;

  name: string;

  category: string;

  description:
    | string
    | null;

  price:
    | number
    | null;

  stock:
    | number
    | null;
};

type DisplaySection = {
  title: string;

  products:
    DisplayProduct[];
};

const money =
  new Intl.NumberFormat(
    "es-MX",
    {
      style:
        "currency",

      currency:
        "MXN",
    }
  );

function slugify(
  value: string
) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /(^-|-$)/g,
      ""
    );
}

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

.store-page .store-hero {
  min-height:
    clamp(
      520px,
      63vh,
      660px
    );

  display: grid;

  grid-template-columns:
    minmax(
      300px,
      .85fr
    )
    minmax(
      420px,
      1.15fr
    );

  align-items: center;

  gap:
    clamp(
      35px,
      6vw,
      95px
    );

  padding:
    clamp(
      68px,
      8vw,
      112px
    )
    clamp(
      24px,
      6vw,
      100px
    );

  position: relative;

  overflow: hidden;

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
}

.store-page
.store-hero::before {
  content: "";

  position: absolute;

  inset: 0;

  background-image:
    linear-gradient(
      rgba(
        255,
        255,
        255,
        .025
      )
      1px,
      transparent
      1px
    ),

    linear-gradient(
      90deg,
      rgba(
        255,
        255,
        255,
        .025
      )
      1px,
      transparent
      1px
    );

  background-size:
    55px 55px;

  pointer-events:
    none;
}

.store-hero-copy {
  position: relative;

  z-index: 2;
}

.store-hero-copy
> p:first-child {
  margin:
    0 0 23px;

  color:
    var(--accent-soft);

  font-size: 10px;

  font-weight: 800;

  letter-spacing:
    .17em;

  text-transform:
    uppercase;
}

.store-hero-copy h1 {
  margin: 0;

  color: #fff;

  font:
    700
    clamp(
      65px,
      8vw,
      128px
    )
    /
    .82
    Arial,
    Helvetica,
    sans-serif;

  letter-spacing:
    -.07em;
}

.tcg-hero-logo {
  display: block;

  width:
    min(
      500px,
      90%
    );

  max-height: 165px;

  object-fit: contain;

  object-position:
    left center;

  margin:
    0 0 28px;
}

.store-subtitle {
  max-width: 520px;

  margin:
    24px 0 29px;

  color: #c5cada;

  font-size: 15px;

  line-height: 1.6;
}

.store-hero-copy
> a {
  display:
    inline-flex;

  align-items:
    center;

  gap: 25px;

  padding:
    13px 19px;

  border-radius:
    100px;

  background: #fff;

  color: #0b1020;

  text-decoration:
    none;

  font-size: 13px;

  font-weight: 700;
}

.store-hero-copy
> a:hover {
  background:
    var(--accent-soft);
}

.store-hero-media {
  position: relative;

  z-index: 2;

  width: 100%;

  height:
    clamp(
      300px,
      32vw,
      430px
    );

  padding:
    clamp(
      16px,
      2vw,
      28px
    );

  display: grid;

  place-items:
    center;

  overflow: hidden;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      .12
    );

  border-radius:
    30px;

  background:
    rgba(
      4,
      8,
      18,
      .72
    );

  box-shadow:
    0
    35px
    90px
    rgba(
      0,
      0,
      0,
      .38
    );
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
    blur(105px);

  opacity: .15;
}

.store-cover-image {
  position: relative;

  z-index: 1;

  display: block;

  width: 100%;

  height: 100%;

  object-fit: contain;

  object-position:
    center;
}

.store-cover-placeholder {
  width: 100%;

  height: 100%;

  display: grid;

  place-items:
    center;

  border:
    1px dashed
    rgba(
      255,
      255,
      255,
      .18
    );

  border-radius:
    22px;

  color:
    rgba(
      255,
      255,
      255,
      .45
    );

  font-size: 10px;

  text-transform:
    uppercase;

  letter-spacing:
    .15em;
}


/* ========================
   CATÁLOGO
======================== */

.store-page
.catalog-wrap {
  padding:
    clamp(
      70px,
      8vw,
      115px
    )
    clamp(
      22px,
      6vw,
      100px
    );

  background:
    radial-gradient(
      circle at 90% 0%,
      rgba(
        111,
        107,
        234,
        .12
      ),
      transparent 30%
    ),

    linear-gradient(
      180deg,
      #10162a,
      #0c1223
    );

  color: #f5f7ff;
}

.store-page
.catalog-top {
  display: flex;

  align-items: end;

  justify-content:
    space-between;

  gap: 30px;

  padding-bottom:
    28px;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      .1
    );
}

.store-page
.catalog-top p {
  margin:
    0 0 15px;

  color:
    var(--accent-soft);

  font-size: 10px;

  font-weight: 800;

  text-transform:
    uppercase;

  letter-spacing:
    .14em;
}

.store-page
.catalog-top h2 {
  margin: 0;

  color: #fff;

  font:
    400
    clamp(
      43px,
      5vw,
      72px
    )
    /
    .9
    Georgia,
    serif;

  letter-spacing:
    -.055em;
}

.store-page
.filter-button {
  border:
    1px solid
    rgba(
      255,
      255,
      255,
      .14
    );

  border-radius:
    100px;

  background:
    rgba(
      255,
      255,
      255,
      .07
    );

  color: #fff;

  padding:
    10px 14px;

  font-size: 13px;
}

.store-page
.filter-button span {
  padding-left:
    26px;
}

.store-page
.category-nav {
  display: flex;

  gap: 24px;

  overflow: auto;

  white-space:
    nowrap;

  padding:
    20px 0;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      .1
    );

  font-size: 13px;
}

.store-page
.category-nav a {
  color: #cfd4e3;

  text-decoration:
    none;
}

.store-page
.category-nav a:hover {
  color:
    var(--accent-soft);
}

.store-page
.product-section {
  padding:
    48px
    0
    14px;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      .07
    );
}

.store-page
.product-section-title {
  display: flex;

  align-items:
    baseline;

  gap: 17px;

  margin-bottom:
    22px;
}

.store-page
.product-section-title
span {
  color:
    var(--accent-soft);

  font:
    17px
    Georgia,
    serif;
}

.store-page
.product-section-title
h3 {
  margin: 0;

  color: #fff;

  font:
    400
    clamp(
      33px,
      3.2vw,
      50px
    )
    /
    .95
    Georgia,
    serif;

  letter-spacing:
    -.05em;
}

.store-page
.product-section-title
a {
  margin-left: auto;

  color: #bfc5d6;

  text-decoration:
    none;

  font-size: 12px;
}

.store-page
.product-grid {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      1fr
    );

  gap: 16px;
}

.store-page
.product-card {
  min-width: 0;

  overflow: hidden;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      .08
    );

  border-radius:
    16px;

  background:
    #161d32;

  box-shadow:
    0
    18px
    40px
    rgba(
      0,
      0,
      0,
      .16
    );
}

.store-page
.product-image {
  height: 220px;

  display: flex;

  align-items:
    center;

  justify-content:
    center;

  flex-direction:
    column;

  position: relative;

  overflow: hidden;

  background:
    linear-gradient(
      145deg,
      #10162a,
      #1c2541
    );

  color: #c9cede;
}

.store-page
.product-image span {
  font-size: 12px;
}

.store-page
.product-image small {
  margin-top: 5px;

  color: #818ba0;

  font-size: 10px;
}

.store-page
.product-image > b {
  position: absolute;

  top: 12px;

  right: 13px;

  color: #758099;

  font:
    14px
    Georgia,
    serif;
}

.store-page
.product-meta {
  padding: 16px;

  color: #fff;
}

.store-page
.product-meta
> p {
  margin:
    0 0 7px;

  color:
    var(--accent-soft);

  font-size: 9px;

  text-transform:
    uppercase;

  letter-spacing:
    .12em;
}

.store-page
.product-meta h4 {
  min-height: 39px;

  margin: 0;

  font-size: 16px;

  line-height: 1.3;
}

.product-description {
  min-height: 37px;

  margin:
    8px 0 0;

  color: #939db2;

  font-size: 11px;

  line-height: 1.45;
}

.product-stock {
  display: block;

  margin-top: 10px;

  color: #8792a7;

  font-size: 10px;
}

.store-page
.product-meta
> div:last-child {
  display: flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap: 12px;

  margin-top: 15px;

  padding-top: 12px;

  border-top:
    1px solid
    rgba(
      255,
      255,
      255,
      .09
    );
}

.store-page
.product-meta strong {
  color: #f4f6fb;

  font-size: 13px;
}

.store-page
.product-meta button {
  min-width: 36px;

  height: 36px;

  border: 0;

  border-radius: 50%;

  background:
    var(--accent);

  color: #fff;

  font-size: 20px;
}

.store-page
.product-meta
button:disabled {
  cursor:
    not-allowed;

  opacity: .35;
}

.catalog-message {
  padding:
    25px 0;

  color: #929db3;

  font-size: 13px;
}

.toast {
  position: fixed;

  z-index: 80;

  bottom: 22px;

  left: 50%;

  transform:
    translateX(-50%);

  padding:
    12px 18px;

  border-radius:
    100px;

  background: #fff;

  color: #0b1020;

  box-shadow:
    0
    15px
    40px
    rgba(
      0,
      0,
      0,
      .28
    );

  font-size: 13px;

  font-weight: 700;
}

@media(
  max-width:1000px
) {
  .store-page
  .store-hero {
    grid-template-columns:
      1fr;

    min-height: auto;

    padding-top:
      75px;
  }

  .store-hero-media {
    height:
      clamp(
        280px,
        55vw,
        420px
      );
  }
}

@media(
  max-width:820px
) {
  .store-page
  .product-grid {
    grid-template-columns:
      repeat(
        2,
        1fr
      );
  }
}

@media(
  max-width:600px
) {
  .store-page
  .store-hero {
    padding:
      58px 20px;
  }

  .store-hero-copy h1 {
    font-size:
      64px;
  }

  .tcg-hero-logo {
    max-height:
      115px;
  }

  .store-hero-media {
    height: 260px;

    padding: 13px;

    border-radius:
      20px;
  }

  .store-page
  .catalog-wrap {
    padding:
      55px 20px;
  }

  .store-page
  .catalog-top {
    align-items:
      flex-start;

    flex-direction:
      column;
  }

  .store-page
  .product-grid {
    grid-template-columns:
      1fr;
  }
}
`;

export function TcgPage({
  config,
}: {
  config:
    StoreConfig;
}) {
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

  const [
    dbProducts,
    setDbProducts,
  ] =
    useState<
      DbProduct[]
    >([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] =
    useState(true);

  const {
    addItem,
  } = useCart();

  useEffect(() => {
    if (!supabase) {
      setLoadingProducts(
        false
      );

      return;
    }

    const client =
      supabase;

    const load =
      async () => {
        const [
          coverResult,
          logoResult,
          productResult,
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

            client
              .from(
                "products"
              )
              .select(
                "id,tcg,name,category,description,price_mxn,stock"
              )
              .eq(
                "tcg",
                config.slug
              )
              .eq(
                "status",
                "published"
              )
              .order(
                "created_at",
                {
                  ascending:
                    false,
                }
              ),
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

        if (
          productResult.error
        ) {
          console.error(
            "No se pudieron cargar los productos:",
            productResult.error
          );

          setDbProducts(
            []
          );
        } else {
          setDbProducts(
            (
              productResult.data ??
              []
            ) as DbProduct[]
          );
        }

        setLoadingProducts(
          false
        );
      };

    load();
  }, [config.slug]);

  const sections =
    useMemo<
      DisplaySection[]
    >(
      () => {
        if (
          dbProducts.length ===
          0
        ) {
          return config.sections.map(
            (section) => ({
              title:
                section.title,

              products:
                section.products.map(
                  (name) => ({
                    id:
                      `fallback-${config.slug}-${slugify(
                        section.title
                      )}-${slugify(
                        name
                      )}`,

                    name,

                    category:
                      section.title,

                    description:
                      null,

                    price:
                      null,

                    stock:
                      null,
                  })
                ),
            })
          );
        }

        const byCategory =
          new Map<
            string,
            DisplayProduct[]
          >();

        for (
          const product of
          dbProducts
        ) {
          const list =
            byCategory.get(
              product.category
            ) ?? [];

          list.push({
            id:
              product.id,

            name:
              product.name,

            category:
              product.category,

            description:
              product.description,

            price:
              Number(
                product.price_mxn
              ),

            stock:
              product.stock,
          });

          byCategory.set(
            product.category,
            list
          );
        }

        const preferred =
          config.sections.map(
            (section) =>
              section.title
          );

        const extras =
          [
            ...byCategory.keys(),
          ].filter(
            (category) =>
              !preferred.includes(
                category
              )
          );

        return [
          ...preferred,
          ...extras,
        ]
          .filter(
            (category) =>
              byCategory.has(
                category
              )
          )
          .map(
            (category) => ({
              title:
                category,

              products:
                byCategory.get(
                  category
                ) ?? [],
            })
          );
      },
      [
        dbProducts,
        config.sections,
        config.slug,
      ]
    );

  const addToCart = (
    product:
      DisplayProduct
  ) => {
    if (
      product.stock === 0
    ) {
      return;
    }

    addItem({
      id:
        product.id,

      name:
        product.name,

      tcg:
        config.name,

      price:
        product.price,

      stock:
        product.stock,
    });

    setNotice(
      `${product.name} añadido al carrito`
    );

    window.setTimeout(
      () =>
        setNotice(""),
      2200
    );
  };

  return (
    <>
      <style>
        {styles}
      </style>

      <main
        className={`store-page ${config.accent}`}
      >
        <SiteHeader
          variant="dark"
        />

        <section className="store-hero">
          <div className="store-hero-copy">
            <p>
              CATÁLOGO
            </p>

            {logo ? (
              <img
                className="tcg-hero-logo"
                src={logo}
                alt={`Logo ${config.name}`}
              />
            ) : (
              <h1>
                {
                  config.name
                }
              </h1>
            )}

            <p className="store-subtitle">
              {
                config.subtitle
              }
            </p>

            <a href="#catalogo">
              Explorar
              catálogo

              <span>
                ↓
              </span>
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
              Filtros

              <span>
                ⌄
              </span>
            </button>
          </div>

          {sections.length >
            0 && (
            <nav className="category-nav">
              {sections.map(
                (section) => (
                  <a
                    href={`#${slugify(
                      section.title
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
          )}

          {loadingProducts && (
            <p className="catalog-message">
              Cargando
              catálogo…
            </p>
          )}

          {!loadingProducts &&
            sections.map(
              (
                section,
                sectionIndex
              ) => (
                <section
                  key={
                    section.title
                  }
                  id={slugify(
                    section.title
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
                      Volver arriba
                      ↗
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
                            product.id
                          }
                        >
                          <div className="product-image">
                            <div
                              className={`image-loader loader-${config.slug}`}
                              aria-hidden="true"
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
                              Galería
                              disponible
                              próximamente
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
                                product.name
                              }
                            </h4>

                            {product.description && (
                              <p className="product-description">
                                {
                                  product.description
                                }
                              </p>
                            )}

                            {product.stock !==
                              null && (
                              <small className="product-stock">
                                {product.stock >
                                0
                                  ? `${product.stock} disponible${
                                      product.stock ===
                                      1
                                        ? ""
                                        : "s"
                                    }`
                                  : "Agotado"}
                              </small>
                            )}

                            <div>
                              <strong>
                                {product.price ===
                                null
                                  ? "Consultar precio"
                                  : money.format(
                                      product.price
                                    )}
                              </strong>

                              <button
                                type="button"
                                disabled={
                                  product.stock ===
                                  0
                                }
                                onClick={() =>
                                  addToCart(
                                    product
                                  )
                                }
                                aria-label={`Añadir ${product.name} al carrito`}
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

        <SiteFooter />

        {notice && (
          <output className="toast">
            {notice}
          </output>
        )}
      </main>
    </>
  );
}