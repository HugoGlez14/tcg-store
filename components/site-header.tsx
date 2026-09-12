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
  useCart,
} from "@/components/cart-provider";

import {
  supabase,
} from "@/lib/supabase";

import styles from "./site-header.module.css";

type TcgSlug =
  | "pokemon"
  | "riftbound"
  | "yugioh";

type LogoMap =
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
}[] = [
  {
    slug: "pokemon",
    name: "Pokémon",
    href: "/pokemon",
  },

  {
    slug: "riftbound",
    name: "Riftbound",
    href: "/riftbound",
  },

  {
    slug: "yugioh",
    name: "Yu-Gi-Oh!",
    href: "/yugioh",
  },
];

const money =
  new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
    }
  );

export function SiteHeader({
  variant = "light",
}: {
  variant?:
    | "light"
    | "dark";
}) {
  const [
    logos,
    setLogos,
  ] =
    useState<LogoMap>(
      {}
    );

  const [
    cartOpen,
    setCartOpen,
  ] =
    useState(false);

  const {
    items,
    totalItems,
    totalAmount,
    hasUnpricedItems,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client =
      supabase;

    const loadLogos =
      async () => {
        const {
          data,
          error,
        } =
          await client
            .from(
              "tcg_logos"
            )
            .select(
              "tcg,storage_path"
            );

        if (error) {
          console.error(
            "No se pudieron cargar los logos:",
            error
          );

          return;
        }

        const next:
          LogoMap = {};

        for (
          const row of
          data ?? []
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
            data:
              publicData,
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
            publicData.publicUrl;
        }

        setLogos(next);
      };

    loadLogos();
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      cartOpen
        ? "hidden"
        : "";

    const closeOnEscape =
      (
        event:
          KeyboardEvent
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          setCartOpen(
            false
          );
        }
      };

    window.addEventListener(
      "keydown",
      closeOnEscape
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        closeOnEscape
      );
    };
  }, [cartOpen]);

  return (
    <>
      <header
        className={`
          ${styles.header}

          ${
            variant ===
            "dark"
              ? styles.dark
              : styles.light
          }
        `}
      >
        <Link
          className={
            styles.brand
          }
          href="/"
          aria-label="Ir al inicio de Pokeamigos"
        >
          <span
            aria-hidden="true"
          >
            [ ]
          </span>

          <strong>
            POKEAMIGOS
          </strong>
        </Link>

        <nav
          className={
            styles.games
          }
          aria-label="Catálogos"
        >
          {games.map(
            (game) => (
              <Link
                className={
                  styles.gameLink
                }
                href={
                  game.href
                }
                key={
                  game.slug
                }
              >
                {logos[
                  game.slug
                ] ? (
                  <img
                    className={
                      styles.navLogo
                    }
                    src={
                      logos[
                        game
                          .slug
                      ]
                    }
                    alt={
                      game.name
                    }
                  />
                ) : (
                  <span>
                    {
                      game.name
                    }
                  </span>
                )}
              </Link>
            )
          )}
        </nav>

        <div
          className={
            styles.actions
          }
        >
          <AuthButton />

          <Link
            className={
              styles.admin
            }
            href="/admin"
          >
            Admin
          </Link>

          <button
            className={
              styles.cartButton
            }
            type="button"
            onClick={() =>
              setCartOpen(
                true
              )
            }
            aria-expanded={
              cartOpen
            }
            aria-controls="pokeamigos-cart"
          >
            Carrito

            <b>
              {totalItems}
            </b>
          </button>
        </div>
      </header>

      {cartOpen && (
        <div
          className={
            styles.cartLayer
          }
        >
          <button
            className={
              styles.backdrop
            }
            type="button"
            aria-label="Cerrar carrito"
            onClick={() =>
              setCartOpen(
                false
              )
            }
          />

          <aside
            id="pokeamigos-cart"
            className={
              styles.drawer
            }
            aria-label="Carrito de compras"
          >
            <div
              className={
                styles.drawerHead
              }
            >
              <div>
                <small>
                  POKEAMIGOS
                </small>

                <h2>
                  Tu carrito
                </h2>
              </div>

              <button
                className={
                  styles.close
                }
                type="button"
                onClick={() =>
                  setCartOpen(
                    false
                  )
                }
                aria-label="Cerrar carrito"
              >
                ×
              </button>
            </div>

            {items.length ===
            0 ? (
              <div
                className={
                  styles.emptyCart
                }
              >
                <span>
                  ◇
                </span>

                <h3>
                  Tu carrito
                  está vacío.
                </h3>

                <p>
                  Agrega productos
                  desde cualquiera
                  de nuestros
                  catálogos.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setCartOpen(
                      false
                    )
                  }
                >
                  Seguir
                  explorando
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    styles.lines
                  }
                >
                  {items.map(
                    (item) => (
                      <article
                        className={
                          styles.line
                        }
                        key={
                          item.id
                        }
                      >
                        <div
                          className={
                            styles.lineTop
                          }
                        >
                          <div>
                            <small>
                              {
                                item.tcg
                              }
                            </small>

                            <h3>
                              {
                                item.name
                              }
                            </h3>
                          </div>

                          <button
                            className={
                              styles.remove
                            }
                            type="button"
                            onClick={() =>
                              removeItem(
                                item.id
                              )
                            }
                          >
                            Quitar
                          </button>
                        </div>

                        <div
                          className={
                            styles.lineBottom
                          }
                        >
                          <div
                            className={
                              styles.quantity
                            }
                          >
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity -
                                    1
                                )
                              }
                            >
                              −
                            </button>

                            <span>
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              type="button"
                              disabled={Boolean(
                                item.stock &&
                                  item.quantity >=
                                    item.stock
                              )}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity +
                                    1
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <strong>
                            {item.price ===
                            null
                              ? "Precio por confirmar"
                              : money.format(
                                  item.price *
                                    item.quantity
                                )}
                          </strong>
                        </div>
                      </article>
                    )
                  )}
                </div>

                <div
                  className={
                    styles.summary
                  }
                >
                  <div>
                    <span>
                      Productos
                    </span>

                    <b>
                      {
                        totalItems
                      }
                    </b>
                  </div>

                  <div
                    className={
                      styles.total
                    }
                  >
                    <span>
                      Subtotal
                    </span>

                    <strong>
                      {money.format(
                        totalAmount
                      )}
                    </strong>
                  </div>

                  {hasUnpricedItems && (
                    <p>
                      Los productos
                      con precio por
                      confirmar todavía
                      no se incluyen
                      en el subtotal.
                    </p>
                  )}

                  <button
                    className={
                      styles.clear
                    }
                    type="button"
                    onClick={
                      clearCart
                    }
                  >
                    Vaciar carrito
                  </button>

                  <button
                    className={
                      styles.continue
                    }
                    type="button"
                    onClick={() =>
                      setCartOpen(
                        false
                      )
                    }
                  >
                    Seguir comprando
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}