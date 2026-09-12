"use client";

import "./admin.css";
import "./admin-enhancements.css";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "@/lib/supabase";

import {
  ProductManager,
} from "@/components/admin-product-manager";

const tabs = [
  "Resumen",
  "Productos",
  "Usuarios",
  "Imágenes",
  "Pedidos",
  "Pagos",
  "Ajustes",
];

type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;

  role:
    | "admin"
    | "customer";

  created_at: string;
};

type CoverInfo = {
  path: string;
  url: string;
};

type CoverMap =
  Record<string, CoverInfo>;

type CoverTarget =
  | "home"
  | "catalog";

const coverOptions = [
  {
    slug: "pokemon",
    name: "Pokémon",
  },
  {
    slug: "riftbound",
    name: "Riftbound",
  },
  {
    slug: "yugioh",
    name: "Yu-Gi-Oh!",
  },
];

export default function AdminPage() {
  const [
    tab,
    setTab,
  ] = useState("Resumen");

  const [
    saved,
    setSaved,
  ] = useState("");

  const [
    accessState,
    setAccessState,
  ] = useState<
    | "loading"
    | "setup"
    | "login"
    | "denied"
    | "allowed"
  >("loading");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    accessMessage,
    setAccessMessage,
  ] = useState("");

  useEffect(() => {
    if (!supabase) {
      setAccessState(
        "setup"
      );

      return;
    }

    const client = supabase;

    const checkAccess =
      async () => {
        const {
          data,
          error,
        } =
          await client.auth.getUser();

        if (
          error ||
          !data.user
        ) {
          setAccessState(
            "login"
          );

          return;
        }

        const {
          data: profile,
          error:
            profileError,
        } = await client
          .from("profiles")
          .select("role")
          .eq(
            "id",
            data.user.id
          )
          .maybeSingle();

        if (profileError) {
          console.error(
            "Error consultando perfil:",
            profileError
          );

          setAccessState(
            "denied"
          );

          return;
        }

        setAccessState(
          profile?.role ===
            "admin"
            ? "allowed"
            : "denied"
        );
      };

    checkAccess();

    const {
      data: listener,
    } =
      client.auth.onAuthStateChange(
        () => {
          checkAccess();
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const save = (
    message: string
  ) => {
    setSaved(message);

    setTimeout(() => {
      setSaved("");
    }, 2500);
  };

  const signIn = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!supabase) return;

    const {
      error,
    } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    setAccessMessage(
      error
        ? error.message
        : "Acceso correcto."
    );
  };

  const google =
    async () => {
      if (!supabase) return;

      await supabase.auth.signInWithOAuth(
        {
          provider: "google",

          options: {
            redirectTo:
              `${window.location.origin}/admin`,
          },
        }
      );
    };

  if (
    accessState !==
    "allowed"
  ) {
    return (
      <main className="admin-page">
        <section className="admin-main">
          <div className="admin-card">
            <p>
              Acceso privado
            </p>

            {accessState ===
              "loading" && (
              <h1>
                Verificando
                acceso…
              </h1>
            )}

            {accessState ===
              "setup" && (
              <>
                <h1>
                  Administrador
                  protegido
                </h1>

                <span>
                  La conexión de
                  datos aún no está
                  configurada.
                </span>
              </>
            )}

            {accessState ===
              "login" && (
              <>
                <h1>
                  Inicia sesión
                </h1>

                <span>
                  Solo cuentas
                  autorizadas pueden
                  editar la tienda.
                </span>

                <form
                  className="form-panel"
                  onSubmit={
                    signIn
                  }
                >
                  <label>
                    Correo

                    <input
                      type="email"
                      value={
                        email
                      }
                      onChange={(
                        event
                      ) =>
                        setEmail(
                          event
                            .target
                            .value
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Contraseña

                    <input
                      type="password"
                      minLength={6}
                      value={
                        password
                      }
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event
                            .target
                            .value
                        )
                      }
                      required
                    />
                  </label>

                  <button
                    className="primary-action"
                    type="submit"
                  >
                    Entrar
                  </button>
                </form>

                <button
                  className="secondary"
                  onClick={
                    google
                  }
                >
                  Continuar con
                  Google
                </button>

                {accessMessage && (
                  <p>
                    {
                      accessMessage
                    }
                  </p>
                )}
              </>
            )}

            {accessState ===
              "denied" && (
              <>
                <h1>
                  Cuenta sin
                  permiso
                </h1>

                <span>
                  Esta cuenta no
                  tiene rol de
                  administrador.
                </span>
              </>
            )}

            <br />
            <br />

            <Link href="/">
              ← Volver a la tienda
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link
          className="wordmark"
          href="/"
        >
          [ ]{" "}
          <span>
            TCG STORE
          </span>
        </Link>

        <div className="admin-caption">
          Administración
        </div>

        <nav>
          {tabs.map(
            (item) => (
              <button
                type="button"
                className={
                  tab === item
                    ? "selected"
                    : ""
                }
                key={item}
                onClick={() =>
                  setTab(
                    item
                  )
                }
              >
                {item}
              </button>
            )
          )}
        </nav>

        <div className="admin-user">
          <b>
            Administrador
          </b>

          <span>
            Acceso principal
          </span>

          <Link href="/">
            ← Ver tienda
          </Link>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-top">
          <div>
            <p>
              Panel de control
            </p>

            <h1>{tab}</h1>
          </div>

          <button
            className="publish"
            type="button"
            onClick={() =>
              save(
                "Cambios guardados"
              )
            }
          >
            Guardar cambios
          </button>
        </header>

        {tab ===
          "Resumen" && (
          <Overview
            setTab={
              setTab
            }
          />
        )}

        {tab ===
          "Productos" && (
          <ProductManager />
        )}

        {tab ===
          "Usuarios" && (
          <Users />
        )}

        {tab ===
          "Imágenes" && (
          <ImageManager
            save={save}
          />
        )}

        {tab ===
          "Pagos" && (
          <Payments
            save={save}
          />
        )}

        {tab ===
          "Pedidos" && (
          <Orders />
        )}

        {tab ===
          "Ajustes" && (
          <Settings
            save={save}
          />
        )}
      </section>

      {saved && (
        <output className="admin-toast">
          ✓ {saved}
        </output>
      )}
    </main>
  );
}


/* =========================================
   RESUMEN
========================================= */

function Overview({
  setTab,
}: {
  setTab: (
    tab: string
  ) => void;
}) {
  return (
    <>
      <section className="metrics">
        <article>
          <small>
            Ventas del mes
          </small>

          <strong>
            $0.00
          </strong>

          <span>
            Se activa al
            conectar pagos
          </span>
        </article>

        <article>
          <small>
            Pedidos pendientes
          </small>

          <strong>
            03
          </strong>

          <span>
            Requieren revisión
          </span>
        </article>

        <article>
          <small>
            Productos publicados
          </small>

          <strong>
            12
          </strong>

          <span>
            3 catálogos activos
          </span>
        </article>
      </section>

      <section className="admin-grid">
        <article className="admin-card wide">
          <div className="card-heading">
            <div>
              <p>
                Acceso rápido
              </p>

              <h2>
                Prepara tu tienda
                para vender.
              </h2>
            </div>
          </div>

          <div className="quick-actions">
            <button
              type="button"
              onClick={() =>
                setTab(
                  "Productos"
                )
              }
            >
              ＋ Añadir producto
            </button>

            <button
              type="button"
              onClick={() =>
                setTab(
                  "Imágenes"
                )
              }
            >
              ▣ Cambiar
              portadas
            </button>

            <button
              type="button"
              onClick={() =>
                setTab(
                  "Ajustes"
                )
              }
            >
              ⚙ Ajustes de
              tienda
            </button>
          </div>
        </article>

        <article className="admin-card">
          <p>
            Estado de
            lanzamiento
          </p>

          <div className="launch-progress">
            <i />
            <i />
            <i />
            <i />
          </div>

          <ol>
            <li className="done">
              Catálogos creados
            </li>

            <li className="done">
              Estructura de
              productos
            </li>

            <li>
              Conectar pagos
            </li>

            <li>
              Publicar inventario
            </li>
          </ol>
        </article>
      </section>
    </>
  );
}


/* =========================================
   USUARIOS
========================================= */

function Users() {
  const [
    users,
    setUsers,
  ] =
    useState<
      UserProfile[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    if (!supabase) {
      setError(
        "Supabase no está configurado."
      );

      setLoading(false);

      return;
    }

    const client = supabase;

    const loadUsers =
      async () => {
        const {
          data,
          error:
            queryError,
        } =
          await client
            .from(
              "profiles"
            )
            .select(
              "id,email,full_name,avatar_url,role,created_at"
            )
            .order(
              "created_at",
              {
                ascending:
                  false,
              }
            );

        if (
          queryError
        ) {
          console.error(
            "Error cargando usuarios:",
            queryError
          );

          setError(
            queryError.message
          );

          setUsers([]);
        } else {
          setUsers(
            (data ??
              []) as UserProfile[]
          );

          setError("");
        }

        setLoading(
          false
        );
      };

    loadUsers();
  }, []);

  return (
    <section className="admin-card users-panel">
      <div className="card-heading">
        <div>
          <p>
            Clientes
            registrados
          </p>

          <h2>
            Usuarios
          </h2>
        </div>

        <b className="users-count">
          {users.length}
        </b>
      </div>

      {loading && (
        <p className="users-message">
          Cargando usuarios…
        </p>
      )}

      {!loading &&
        error && (
          <p className="users-error">
            No se pudieron
            cargar los
            usuarios:{" "}
            {error}
          </p>
        )}

      {!loading &&
        !error &&
        users.length ===
          0 && (
          <p className="users-message">
            Todavía no hay
            usuarios
            registrados.
          </p>
        )}

      {!loading &&
        !error &&
        users.length >
          0 && (
          <div className="users-list">
            <div className="user-row user-row-head">
              <span>
                Usuario
              </span>

              <span>
                Correo
              </span>

              <span>
                Rol
              </span>

              <span>
                Registro
              </span>
            </div>

            {users.map(
              (user) => {
                const
                  displayName =
                    user.full_name ||
                    user.email?.split(
                      "@"
                    )[0] ||
                    "Sin nombre";

                const
                  initial =
                    displayName
                      .slice(
                        0,
                        1
                      )
                      .toUpperCase();

                return (
                  <div
                    className="user-row"
                    key={
                      user.id
                    }
                  >
                    <div className="user-identity">
                      {user.avatar_url ? (
                        <span
                          className="user-avatar"
                          style={{
                            backgroundImage:
                              `url(${user.avatar_url})`,
                          }}
                        />
                      ) : (
                        <span className="user-avatar user-avatar-fallback">
                          {
                            initial
                          }
                        </span>
                      )}

                      <b>
                        {
                          displayName
                        }
                      </b>
                    </div>

                    <span>
                      {user.email ||
                        "Sin correo"}
                    </span>

                    <em
                      className={
                        user.role ===
                        "admin"
                          ? "role-admin"
                          : "role-customer"
                      }
                    >
                      {user.role ===
                      "admin"
                        ? "Admin"
                        : "Cliente"}
                    </em>

                    <span>
                      {new Date(
                        user.created_at
                      ).toLocaleDateString(
                        "es-MX"
                      )}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        )}
    </section>
  );
}


/* =========================================
   IMÁGENES
========================================= */

function ImageManager({
  save,
}: {
  save: (
    message: string
  ) => void;
}) {
  const [
    homeCovers,
    setHomeCovers,
  ] =
    useState<CoverMap>({});

  const [
    catalogCovers,
    setCatalogCovers,
  ] =
    useState<CoverMap>({});

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    uploading,
    setUploading,
  ] =
    useState("");

  /*
   * Cargar todas las
   * portadas desde Supabase.
   */
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;

    const buildMap = (
      rows:
        | {
            tcg: string;
            storage_path:
              string;
          }[]
        | null
    ) => {
      const map:
        CoverMap = {};

      for (
        const row of
        rows ?? []
      ) {
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

        map[row.tcg] = {
          path:
            row.storage_path,

          url:
            data.publicUrl,
        };
      }

      return map;
    };

    const loadCovers =
      async () => {
        const [
          homeResult,
          catalogResult,
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
                "catalog_covers"
              )
              .select(
                "tcg,storage_path"
              ),
          ]);

        if (
          homeResult.error
        ) {
          console.error(
            "Error cargando portadas de inicio:",
            homeResult.error
          );
        }

        if (
          catalogResult.error
        ) {
          console.error(
            "Error cargando portadas internas:",
            catalogResult.error
          );
        }

        setHomeCovers(
          buildMap(
            homeResult.data
          )
        );

        setCatalogCovers(
          buildMap(
            catalogResult.data
          )
        );

        setLoading(false);
      };

    loadCovers();
  }, []);

  /*
   * Subir o reemplazar
   * una portada.
   */
  const uploadCover =
    async (
      target:
        CoverTarget,
      slug: string,
      name: string,
      file?: File
    ) => {
      if (
        !file ||
        !supabase
      ) {
        return;
      }

      if (
        ![
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(
          file.type
        )
      ) {
        save(
          "Solo se permiten JPG, PNG o WebP"
        );

        return;
      }

      if (
        file.size >
        5 *
          1024 *
          1024
      ) {
        save(
          "La imagen debe pesar menos de 5 MB"
        );

        return;
      }

      const client =
        supabase;

      const
        uploadingId =
          `${target}-${slug}`;

      setUploading(
        uploadingId
      );

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase()
          .replace(
            /[^a-z0-9]/g,
            ""
          ) ||
        "jpg";

      const folder =
        target ===
        "home"
          ? "home"
          : "catalog";

      const storagePath =
        `${folder}/${slug}-${Date.now()}.${extension}`;

      const current =
        target ===
        "home"
          ? homeCovers[
              slug
            ]
          : catalogCovers[
              slug
            ];

      try {
        const {
          error:
            uploadError,
        } =
          await client.storage
            .from(
              "catalog-images"
            )
            .upload(
              storagePath,
              file,
              {
                cacheControl:
                  "3600",

                upsert:
                  false,

                contentType:
                  file.type,
              }
            );

        if (
          uploadError
        ) {
          throw uploadError;
        }

        const table =
          target ===
          "home"
            ? "home_covers"
            : "catalog_covers";

        const {
          error: dbError,
        } =
          await client
            .from(table)
            .upsert(
              {
                tcg: slug,

                storage_path:
                  storagePath,

                alt_text:
                  `Portada ${name}`,

                updated_at:
                  new Date()
                    .toISOString(),
              },
              {
                onConflict:
                  "tcg",
              }
            );

        if (dbError) {
          await client.storage
            .from(
              "catalog-images"
            )
            .remove([
              storagePath,
            ]);

          throw dbError;
        }

        /*
         * Ya que la nueva
         * quedó guardada,
         * eliminamos la
         * anterior.
         */
        if (
          current?.path &&
          current.path !==
            storagePath
        ) {
          await client.storage
            .from(
              "catalog-images"
            )
            .remove([
              current.path,
            ]);
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
              storagePath
            );

        const newCover = {
          path:
            storagePath,

          url:
            publicData.publicUrl,
        };

        if (
          target ===
          "home"
        ) {
          setHomeCovers(
            (
              previous
            ) => ({
              ...previous,

              [slug]:
                newCover,
            })
          );
        } else {
          setCatalogCovers(
            (
              previous
            ) => ({
              ...previous,

              [slug]:
                newCover,
            })
          );
        }

        save(
          target ===
            "home"
            ? `Portada de ${name} en inicio actualizada`
            : `Portada interna de ${name} actualizada`
        );
      } catch (
        error
      ) {
        console.error(
          "Error subiendo portada:",
          error
        );

        save(
          "No se pudo guardar la portada"
        );
      } finally {
        setUploading("");
      }
    };

  /*
   * Eliminar portada.
   */
  const removeCover =
    async (
      target:
        CoverTarget,
      slug: string
    ) => {
      if (!supabase) {
        return;
      }

      const client =
        supabase;

      const covers =
        target ===
        "home"
          ? homeCovers
          : catalogCovers;

      const current =
        covers[slug];

      const table =
        target ===
        "home"
          ? "home_covers"
          : "catalog_covers";

      const {
        error,
      } = await client
        .from(table)
        .delete()
        .eq(
          "tcg",
          slug
        );

      if (error) {
        console.error(
          error
        );

        save(
          "No se pudo eliminar la portada"
        );

        return;
      }

      if (
        current?.path
      ) {
        await client.storage
          .from(
            "catalog-images"
          )
          .remove([
            current.path,
          ]);
      }

      if (
        target ===
        "home"
      ) {
        setHomeCovers(
          (
            previous
          ) => {
            const next = {
              ...previous,
            };

            delete next[
              slug
            ];

            return next;
          }
        );
      } else {
        setCatalogCovers(
          (
            previous
          ) => {
            const next = {
              ...previous,
            };

            delete next[
              slug
            ];

            return next;
          }
        );
      }

      save(
        "Portada eliminada"
      );
    };

  /*
   * Tarjetas reutilizables.
   */
  const renderCovers = (
    target:
      CoverTarget,
    covers:
      CoverMap
  ) => (
    <div className="cover-grid">
      {coverOptions.map(
        (cover) => {
          const image =
            covers[
              cover.slug
            ];

          const isUploading =
            uploading ===
            `${target}-${cover.slug}`;

          return (
            <article
              className="cover-card"
              key={`${target}-${cover.slug}`}
            >
              <div
                className={`cover-preview ${
                  image
                    ? "has-image"
                    : ""
                }`}
                style={
                  image
                    ? {
                        backgroundImage:
                          `url("${image.url}")`,
                      }
                    : undefined
                }
              >
                <span>
                  {image
                    ? "Portada cargada"
                    : cover.name}
                </span>
              </div>

              <div>
                <h3>
                  {
                    cover.name
                  }
                </h3>

                <p>
                  {target ===
                  "home"
                    ? "Tarjeta que aparece en la página principal."
                    : `Banner que aparece dentro de ${cover.name}.`}
                </p>
              </div>

              <label className="cover-upload">
                {isUploading
                  ? "Subiendo…"
                  : image
                    ? "Cambiar portada"
                    : "Subir portada"}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={
                    isUploading
                  }
                  onChange={(
                    event
                  ) => {
                    const file =
                      event
                        .target
                        .files?.[0];

                    uploadCover(
                      target,
                      cover.slug,
                      cover.name,
                      file
                    );

                    event.target.value =
                      "";
                  }}
                />
              </label>

              {image && (
                <button
                  className="mini-delete"
                  type="button"
                  onClick={() =>
                    removeCover(
                      target,
                      cover.slug
                    )
                  }
                >
                  Quitar imagen
                </button>
              )}
            </article>
          );
        }
      )}
    </div>
  );

  if (loading) {
    return (
      <section className="admin-card">
        <p>
          Biblioteca visual
        </p>

        <h2>
          Cargando portadas…
        </h2>
      </section>
    );
  }

  return (
    <section className="image-manager">
      {/* ======================
          PÁGINA PRINCIPAL
      ====================== */}

      <div className="payment-intro">
        <div>
          <p>
            Página principal
          </p>

          <h2>
            Portadas de inicio.
          </h2>

          <span>
            Estas son las tres
            tarjetas grandes de
            Pokémon, Riftbound y
            Yu-Gi-Oh! que aparecen
            debajo de “Elige tu
            universo”.
          </span>
        </div>

        <b>
          INICIO
        </b>
      </div>

      {renderCovers(
        "home",
        homeCovers
      )}

      {/* ======================
          PORTADAS INTERNAS
      ====================== */}

      <div
        className="payment-intro"
        style={{
          marginTop: 65,
        }}
      >
        <div>
          <p>
            Catálogos
          </p>

          <h2>
            Portadas internas.
          </h2>

          <span>
            Estas imágenes aparecen
            cuando entras directamente
            al catálogo de Pokémon,
            Riftbound o Yu-Gi-Oh!.
          </span>
        </div>

        <b>
          CATÁLOGOS
        </b>
      </div>

      {renderCovers(
        "catalog",
        catalogCovers
      )}

      <section
        className="admin-card image-guidance"
        style={{
          marginTop: 30,
        }}
      >
        <p>
          Recomendación
        </p>

        <span>
          Para las portadas de inicio
          utiliza imágenes horizontales
          y deja espacio libre en la
          zona inferior izquierda,
          porque ahí aparecerá el nombre
          del juego y su descripción.
        </span>
      </section>
    </section>
  );
}


/* =========================================
   PAGOS
========================================= */

function Payments({
  save,
}: {
  save: (
    message: string
  ) => void;
}) {
  const methods = [
    [
      "Mercado Pago",
      "Recomendado para México",
      "Tarjetas, SPEI y efectivo",
    ],

    [
      "Stripe",
      "Pagos con tarjeta",
      "Visa, Mastercard y AMEX",
    ],

    [
      "PayPal",
      "Pago desde cuenta",
      "Protección para compradores",
    ],

    [
      "Transferencia SPEI",
      "Pago manual",
      "Validación antes de envío",
    ],
  ];

  return (
    <section className="payments">
      <div className="payment-intro">
        <div>
          <p>
            Métodos de pago
          </p>

          <h2>
            Cobra de forma
            segura.
          </h2>

          <span>
            Conecta solamente
            los métodos que
            utilizarás en tu
            tienda.
          </span>
        </div>

        <b>
          Entorno de
          preparación
        </b>
      </div>

      <div className="payment-grid">
        {methods.map(
          (
            [
              name,
              subtitle,
              detail,
            ],
            index
          ) => (
            <article
              key={name}
              className="payment-card"
            >
              <div className="payment-logo">
                {name
                  .slice(
                    0,
                    2
                  )
                  .toUpperCase()}
              </div>

              <div>
                <h3>
                  {name}
                </h3>

                <p>
                  {
                    subtitle
                  }
                </p>

                <small>
                  {
                    detail
                  }
                </small>
              </div>

              <button
                type="button"
                onClick={() =>
                  save(
                    `${name}: configuración pendiente`
                  )
                }
              >
                Configurar{" "}
                <span>→</span>
              </button>

              {index ===
                0 && (
                <em>
                  Recomendado
                </em>
              )}
            </article>
          )
        )}
      </div>
    </section>
  );
}


/* =========================================
   PEDIDOS
========================================= */

function Orders() {
  return (
    <section className="admin-card orders">
      <div className="card-heading">
        <div>
          <p>
            Pedidos
          </p>

          <h2>
            Revisión de
            pedidos
          </h2>
        </div>

        <button
          type="button"
        >
          Exportar
        </button>
      </div>

      <div className="order-row header">
        <span>
          Pedido
        </span>

        <span>
          Cliente
        </span>

        <span>
          Total
        </span>

        <span>
          Estado
        </span>
      </div>

      {[
        "#0003",
        "#0002",
        "#0001",
      ].map(
        (
          order,
          index
        ) => (
          <div
            className="order-row"
            key={order}
          >
            <b>
              {order}
            </b>

            <span>
              {index ===
              0
                ? "Pago por validar"
                : "Cliente de prueba"}
            </span>

            <strong>
              {index ===
              0
                ? "—"
                : "$0.00"}
            </strong>

            <em>
              {index ===
              0
                ? "Pendiente"
                : "Borrador"}
            </em>
          </div>
        )
      )}
    </section>
  );
}


/* =========================================
   AJUSTES
========================================= */

function Settings({
  save,
}: {
  save: (
    message: string
  ) => void;
}) {
  const [
    homeIntro,
    setHomeIntro,
  ] =
    useState("");

  useEffect(() => {
    setHomeIntro(
      localStorage.getItem(
        "tcg-home-intro"
      ) || ""
    );
  }, []);

  const saveHomeIntro =
    () => {
      localStorage.setItem(
        "tcg-home-intro",
        homeIntro.trim()
      );

      save(
        homeIntro.trim()
          ? "Texto de inicio actualizado"
          : "Texto de inicio eliminado"
      );
    };

  return (
    <section className="settings">
      <article className="admin-card">
        <p>
          Datos de la tienda
        </p>

        <label>
          Nombre visible

          <input
            placeholder="Pendiente de definir"
          />
        </label>

        <label>
          Correo de atención

          <input
            type="email"
            placeholder="correo@tutienda.com"
          />
        </label>

        <button
          className="primary-action"
          type="button"
          onClick={() =>
            save(
              "Datos de tienda guardados"
            )
          }
        >
          Guardar datos
        </button>
      </article>

      <article className="admin-card">
        <p>
          Texto de la página
          principal
        </p>

        <span>
          Agrega una frase breve
          debajo de “Elige tu
          universo”.
        </span>

        <label>
          Mensaje de bienvenida

          <input
            value={
              homeIntro
            }
            onChange={(
              event
            ) =>
              setHomeIntro(
                event
                  .target
                  .value
              )
            }
            placeholder="Ej. Cartas, comunidad y grandes hallazgos."
            maxLength={
              120
            }
          />
        </label>

        <button
          className="primary-action"
          type="button"
          onClick={
            saveHomeIntro
          }
        >
          Guardar texto
          de inicio
        </button>
      </article>

      <article className="admin-card">
        <p>
          Envíos y políticas
        </p>

        <span>
          Configura zonas,
          tarifas, tiempos
          de entrega y
          devoluciones.
        </span>

        <Link
          className="secondary"
          href="/politica-de-envios"
        >
          Ver política de
          envíos
        </Link>
      </article>
    </section>
  );
}