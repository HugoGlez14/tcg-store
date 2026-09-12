"use client";

import "./admin.css";
import "./admin-enhancements.css";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProductManager } from "@/components/admin-product-manager";

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
  role: "admin" | "customer";
  created_at: string;
};

export default function AdminPage() {
  const [tab, setTab] = useState("Resumen");
  const [saved, setSaved] = useState("");

  const [accessState, setAccessState] = useState<
    "loading" | "setup" | "login" | "denied" | "allowed"
  >("loading");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessMessage, setAccessMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      setAccessState("setup");
      return;
    }

    const client = supabase;

    const checkAccess = async () => {
      const { data, error } = await client.auth.getUser();

      if (error || !data.user) {
        setAccessState("login");
        return;
      }

      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error consultando perfil:", profileError);
        setAccessState("denied");
        return;
      }

      setAccessState(
        profile?.role === "admin"
          ? "allowed"
          : "denied"
      );
    };

    checkAccess();

    const { data: listener } =
      client.auth.onAuthStateChange(() => {
        checkAccess();
      });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const save = (message: string) => {
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

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setAccessMessage(
      error
        ? error.message
        : "Acceso correcto."
    );
  };

  const google = async () => {
    if (!supabase) return;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
  };

  if (accessState !== "allowed") {
    return (
      <main className="admin-page">
        <section className="admin-main">
          <div className="admin-card">
            <p>Acceso privado</p>

            {accessState === "loading" && (
              <h1>Verificando acceso…</h1>
            )}

            {accessState === "setup" && (
              <>
                <h1>Administrador protegido</h1>

                <span>
                  La conexión de datos aún no está
                  configurada. El panel permanece oculto
                  para visitantes.
                </span>
              </>
            )}

            {accessState === "login" && (
              <>
                <h1>Inicia sesión</h1>

                <span>
                  Solo cuentas autorizadas pueden editar
                  productos e imágenes.
                </span>

                <form
                  className="form-panel"
                  onSubmit={signIn}
                >
                  <label>
                    Correo

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Contraseña

                    <input
                      type="password"
                      minLength={6}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
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
                  onClick={google}
                >
                  Continuar con Google
                </button>

                {accessMessage && (
                  <p>{accessMessage}</p>
                )}
              </>
            )}

            {accessState === "denied" && (
              <>
                <h1>Cuenta sin permiso</h1>

                <span>
                  El propietario debe asignar a esta
                  cuenta el rol de administrador antes de
                  abrir el panel.
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
          [ ] <span>TCG STORE</span>
        </Link>

        <div className="admin-caption">
          Administración
        </div>

        <nav>
          {tabs.map((item) => (
            <button
              className={
                tab === item
                  ? "selected"
                  : ""
              }
              key={item}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="admin-user">
          <b>Administrador</b>

          <span>Acceso principal</span>

          <Link href="/">
            ← Ver tienda
          </Link>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-top">
          <div>
            <p>Panel de control</p>
            <h1>{tab}</h1>
          </div>

          <button
            className="publish"
            onClick={() =>
              save(
                "Cambios guardados como borrador"
              )
            }
          >
            Guardar cambios
          </button>
        </header>

        {tab === "Resumen" && (
          <Overview setTab={setTab} />
        )}

        {tab === "Productos" && (
          <ProductManager />
        )}

        {tab === "Usuarios" && (
          <Users />
        )}

        {tab === "Imágenes" && (
          <ImageManager save={save} />
        )}

        {tab === "Pagos" && (
          <Payments save={save} />
        )}

        {tab === "Pedidos" && (
          <Orders />
        )}

        {tab === "Ajustes" && (
          <Settings save={save} />
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

function Overview({
  setTab,
}: {
  setTab: (tab: string) => void;
}) {
  return (
    <>
      <section className="metrics">
        <article>
          <small>Ventas del mes</small>
          <strong>$0.00</strong>
          <span>
            Se activa al conectar pagos
          </span>
        </article>

        <article>
          <small>Pedidos pendientes</small>
          <strong>03</strong>
          <span>Requieren revisión</span>
        </article>

        <article>
          <small>
            Productos publicados
          </small>
          <strong>12</strong>
          <span>3 catálogos activos</span>
        </article>
      </section>

      <section className="admin-grid">
        <article className="admin-card wide">
          <div className="card-heading">
            <div>
              <p>Acceso rápido</p>

              <h2>
                Prepara tu tienda para vender.
              </h2>
            </div>
          </div>

          <div className="quick-actions">
            <button
              onClick={() =>
                setTab("Productos")
              }
            >
              ＋ Añadir producto
            </button>

            <button
              onClick={() =>
                setTab("Pagos")
              }
            >
              ◉ Configurar pagos
            </button>

            <button
              onClick={() =>
                setTab("Ajustes")
              }
            >
              ⚙ Ajustes de tienda
            </button>
          </div>
        </article>

        <article className="admin-card">
          <p>Estado de lanzamiento</p>

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
              Estructura de productos
            </li>

            <li>Conectar pagos</li>

            <li>Publicar inventario</li>
          </ol>
        </article>
      </section>
    </>
  );
}

function Users() {
  const [users, setUsers] =
    useState<UserProfile[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!supabase) {
      setError(
        "Supabase no está configurado."
      );

      setLoading(false);
      return;
    }

    /*
     * IMPORTANTE:
     * Guardamos supabase en una constante local.
     * Así TypeScript sabe que client no puede ser null
     * dentro de loadUsers().
     */
    const client = supabase;

    const loadUsers = async () => {
      const {
        data,
        error: queryError,
      } = await client
        .from("profiles")
        .select(
          "id,email,full_name,avatar_url,role,created_at"
        )
        .order("created_at", {
          ascending: false,
        });

      if (queryError) {
        console.error(
          "Error cargando usuarios:",
          queryError
        );

        setError(queryError.message);
        setUsers([]);
      } else {
        setUsers(
          (data ?? []) as UserProfile[]
        );

        setError("");
      }

      setLoading(false);
    };

    loadUsers();
  }, []);

  return (
    <section className="admin-card users-panel">
      <div className="card-heading">
        <div>
          <p>Clientes registrados</p>
          <h2>Usuarios</h2>
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

      {!loading && error && (
        <p className="users-error">
          No se pudieron cargar los usuarios:{" "}
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        users.length === 0 && (
          <p className="users-message">
            Todavía no hay usuarios
            registrados.
          </p>
        )}

      {!loading &&
        !error &&
        users.length > 0 && (
          <div className="users-list">
            <div className="user-row user-row-head">
              <span>Usuario</span>
              <span>Correo</span>
              <span>Rol</span>
              <span>Registro</span>
            </div>

            {users.map((user) => {
              const displayName =
                user.full_name ||
                user.email?.split("@")[0] ||
                "Sin nombre";

              const initial =
                displayName
                  .slice(0, 1)
                  .toUpperCase();

              return (
                <div
                  className="user-row"
                  key={user.id}
                >
                  <div className="user-identity">
                    {user.avatar_url ? (
                      <span
                        className="user-avatar"
                        style={{
                          backgroundImage:
                            `url(${user.avatar_url})`,
                        }}
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className="user-avatar user-avatar-fallback"
                        aria-hidden="true"
                      >
                        {initial}
                      </span>
                    )}

                    <b>{displayName}</b>
                  </div>

                  <span>
                    {user.email ||
                      "Sin correo"}
                  </span>

                  <em
                    className={
                      user.role === "admin"
                        ? "role-admin"
                        : "role-customer"
                    }
                  >
                    {user.role === "admin"
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
            })}
          </div>
        )}
    </section>
  );
}

const coverOptions = [
  {
    slug: "pokemon",
    name: "Pokémon",
    hint: "Banner para el catálogo de Pokémon",
  },
  {
    slug: "riftbound",
    name: "Riftbound",
    hint: "Banner para el catálogo de Riftbound",
  },
  {
    slug: "yugioh",
    name: "Yu-Gi-Oh!",
    hint: "Banner para el catálogo de Yu-Gi-Oh!",
  },
];

function ImageManager({
  save,
}: {
  save: (message: string) => void;
}) {
  const [covers, setCovers] =
    useState<Record<string, string>>({});

  useEffect(() => {
    setCovers(
      Object.fromEntries(
        coverOptions.map(({ slug }) => [
          slug,
          localStorage.getItem(
            `tcg-cover-${slug}`
          ) || "",
        ])
      )
    );
  }, []);

  const upload = (
    slug: string,
    file?: File
  ) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      save(
        "Elige un archivo de imagen válido"
      );
      return;
    }

    if (
      file.size >
      3 * 1024 * 1024
    ) {
      save(
        "La imagen debe pesar menos de 3 MB"
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const value = String(
        reader.result
      );

      localStorage.setItem(
        `tcg-cover-${slug}`,
        value
      );

      setCovers((current) => ({
        ...current,
        [slug]: value,
      }));

      save(
        `Portada de ${
          coverOptions.find(
            (cover) =>
              cover.slug === slug
          )?.name
        } actualizada`
      );
    };

    reader.readAsDataURL(file);
  };

  const clear = (slug: string) => {
    localStorage.removeItem(
      `tcg-cover-${slug}`
    );

    setCovers((current) => ({
      ...current,
      [slug]: "",
    }));

    save("Portada eliminada");
  };

  return (
    <section className="image-manager">
      <div className="payment-intro">
        <div>
          <p>Biblioteca visual</p>

          <h2>
            Portadas por TCG.
          </h2>

          <span>
            Sube una portada
            independiente para cada
            catálogo. Se mostrará al
            instante en su página
            correspondiente.
          </span>
        </div>

        <b>JPG · PNG · WebP</b>
      </div>

      <div className="cover-grid">
        {coverOptions.map(
          (cover) => (
            <article
              className="cover-card"
              key={cover.slug}
            >
              <div
                className={`cover-preview ${
                  covers[cover.slug]
                    ? "has-image"
                    : ""
                }`}
                style={
                  covers[cover.slug]
                    ? {
                        backgroundImage:
                          `url(${covers[cover.slug]})`,
                      }
                    : undefined
                }
              >
                <span>
                  {covers[cover.slug]
                    ? "Portada cargada"
                    : cover.name}
                </span>
              </div>

              <div>
                <h3>{cover.name}</h3>
                <p>{cover.hint}</p>
              </div>

              <label className="cover-upload">
                Cambiar portada

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) =>
                    upload(
                      cover.slug,
                      event.target
                        .files?.[0]
                    )
                  }
                />
              </label>

              {covers[
                cover.slug
              ] && (
                <button
                  className="mini-delete"
                  onClick={() =>
                    clear(cover.slug)
                  }
                >
                  Quitar imagen
                </button>
              )}
            </article>
          )
        )}
      </div>

      <section className="admin-card image-guidance">
        <p>
          Imágenes de productos
        </p>

        <span>
          En la sección{" "}
          <b>Productos</b> puedes
          subir varias fotos por
          artículo. La primera será
          su portada; las demás
          quedarán disponibles para
          su galería.
        </span>
      </section>
    </section>
  );
}

function Payments({
  save,
}: {
  save: (message: string) => void;
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
          <p>Métodos de pago</p>

          <h2>
            Cobra de forma segura.
          </h2>

          <span>
            Conecta solo los métodos
            que usarás. Las
            credenciales se guardarán
            como variables privadas y
            nunca se mostrarán a
            compradores.
          </span>
        </div>

        <b>
          Entorno de preparación
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
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <h3>{name}</h3>
                <p>{subtitle}</p>
                <small>{detail}</small>
              </div>

              <button
                onClick={() =>
                  save(
                    `${name}: configuración pendiente de credenciales`
                  )
                }
              >
                Configurar{" "}
                <span>→</span>
              </button>

              {index === 0 && (
                <em>
                  Recomendado
                </em>
              )}
            </article>
          )
        )}
      </div>

      <section className="payment-checklist">
        <h3>
          Antes de activar cobros
        </h3>

        <ul>
          <li>
            Cuenta de negocio
            verificada en la
            plataforma elegida.
          </li>

          <li>
            Política de privacidad,
            términos y devoluciones
            publicadas.
          </li>

          <li>
            Cuenta bancaria para
            recibir depósitos.
          </li>

          <li>
            Prueba de compra en modo
            sandbox antes de publicar.
          </li>
        </ul>
      </section>
    </section>
  );
}

function Orders() {
  return (
    <section className="admin-card orders">
      <div className="card-heading">
        <div>
          <p>Pedidos</p>
          <h2>
            Revisión de pedidos
          </h2>
        </div>

        <button>Exportar</button>
      </div>

      <div className="order-row header">
        <span>Pedido</span>
        <span>Cliente</span>
        <span>Total</span>
        <span>Estado</span>
      </div>

      {[
        "#0003",
        "#0002",
        "#0001",
      ].map(
        (order, index) => (
          <div
            className="order-row"
            key={order}
          >
            <b>{order}</b>

            <span>
              {index === 0
                ? "Pago por validar"
                : "Cliente de prueba"}
            </span>

            <strong>
              {index === 0
                ? "—"
                : "$0.00"}
            </strong>

            <em>
              {index === 0
                ? "Pendiente"
                : "Borrador"}
            </em>
          </div>
        )
      )}
    </section>
  );
}

function Settings({
  save,
}: {
  save: (message: string) => void;
}) {
  const [
    homeIntro,
    setHomeIntro,
  ] = useState("");

  useEffect(() => {
    setHomeIntro(
      localStorage.getItem(
        "tcg-home-intro"
      ) || ""
    );
  }, []);

  const saveHomeIntro = () => {
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
          Texto de la página principal
        </p>

        <span>
          Agrega una frase breve
          debajo de “Elige tu
          universo” o déjalo vacío
          para ocultarla.
        </span>

        <label>
          Mensaje de bienvenida

          <input
            value={homeIntro}
            onChange={(event) =>
              setHomeIntro(
                event.target.value
              )
            }
            placeholder="Ej. Cartas, comunidad y grandes hallazgos."
            maxLength={120}
          />
        </label>

        <button
          className="primary-action"
          onClick={saveHomeIntro}
        >
          Guardar texto de inicio
        </button>
      </article>

      <article className="admin-card">
        <p>Envíos y políticas</p>

        <span>
          Configura zonas, tarifas,
          tiempos de entrega,
          devoluciones y textos
          legales antes de abrir
          ventas.
        </span>

        <button
          className="secondary"
          onClick={() =>
            save(
              "Políticas preparadas para edición"
            )
          }
        >
          Editar políticas
        </button>
      </article>
    </section>
  );
}