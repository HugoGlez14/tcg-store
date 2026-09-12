"use client";

import "./admin-enhancements.css";
import "./admin.css";

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

import {
  AdminMediaManager,
} from "@/components/admin-media-manager";

import {
  AdminAuthPanel,
} from "@/components/admin-auth-panel";

const tabs = [
  {
    name: "Resumen",
    icon: "⌂",
  },
  {
    name: "Productos",
    icon: "◇",
  },
  {
    name: "Usuarios",
    icon: "◎",
  },
  {
    name: "Imágenes",
    icon: "▣",
  },
  {
    name: "Pedidos",
    icon: "□",
  },
  {
    name: "Pagos",
    icon: "$",
  },
  {
    name: "Ajustes",
    icon: "⚙",
  },
];

type TabName =
  | "Resumen"
  | "Productos"
  | "Usuarios"
  | "Imágenes"
  | "Pedidos"
  | "Pagos"
  | "Ajustes";

type UserProfile = {
  id: string;

  email:
    | string
    | null;

  full_name:
    | string
    | null;

  avatar_url:
    | string
    | null;

  role:
    | "admin"
    | "customer";

  created_at: string;
};

type AdminIdentity = {
  name: string;
  email: string;
  avatarUrl:
    | string
    | null;
};

export default function AdminPage() {
  const [
    tab,
    setTab,
  ] =
    useState<TabName>(
      "Resumen"
    );

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
    identity,
    setIdentity,
  ] =
    useState<AdminIdentity>({
      name:
        "Administrador",

      email: "",

      avatarUrl:
        null,
    });

  useEffect(() => {
    if (!supabase) {
      setAccessState(
        "setup"
      );

      return;
    }

    const client =
      supabase;

    const checkAccess =
      async () => {
        const {
          data,
          error,
        } =
          await client.auth
            .getUser();

        if (
          error ||
          !data.user
        ) {
          setAccessState(
            "login"
          );

          setIdentity({
            name:
              "Administrador",

            email: "",

            avatarUrl:
              null,
          });

          return;
        }

        const {
          data: profile,
          error:
            profileError,
        } =
          await client
            .from(
              "profiles"
            )
            .select(
              "role,full_name,email,avatar_url"
            )
            .eq(
              "id",
              data.user.id
            )
            .maybeSingle();

        if (
          profileError
        ) {
          console.error(
            "Error consultando perfil:",
            profileError
          );

          setAccessState(
            "denied"
          );

          return;
        }

        const metadata =
          data.user
            .user_metadata ??
          {};

        const email =
          profile?.email ||
          data.user.email ||
          "";

        const name =
          profile?.full_name ||
          metadata.full_name ||
          metadata.name ||
          email.split(
            "@"
          )[0] ||
          "Administrador";

        setIdentity({
          name,

          email,

          avatarUrl:
            profile?.avatar_url ||
            metadata.avatar_url ||
            metadata.picture ||
            null,
        });

        setAccessState(
          profile?.role ===
            "admin"
            ? "allowed"
            : "denied"
        );
      };

    checkAccess();

    const {
      data:
        authListener,
    } =
      client.auth
        .onAuthStateChange(
          () => {
            checkAccess();
          }
        );

    return () => {
      authListener
        .subscription
        .unsubscribe();
    };
  }, []);

  const save = (
    message: string
  ) => {
    setSaved(
      message
    );

    window.setTimeout(
      () => {
        setSaved("");
      },
      2500
    );
  };

  const signOut =
    async () => {
      if (!supabase) {
        return;
      }

      await supabase.auth
        .signOut();

      setAccessState(
        "login"
      );

      setTab(
        "Resumen"
      );
    };

  if (
    accessState !==
    "allowed"
  ) {
    return (
      <AdminAuthPanel
        accessState={
          accessState
        }
        onSignOut={
          signOut
        }
      />
    );
  }

  const tabDescription: Record<
    TabName,
    string
  > = {
    Resumen:
      "Vista general de tu tienda y accesos rápidos.",

    Productos:
      "Administra catálogo, precios, stock y publicación.",

    Usuarios:
      "Consulta las cuentas registradas en Pokeamigos.",

    Imágenes:
      "Administra logos, portadas de inicio y banners.",

    Pedidos:
      "Revisa y administra las compras de tus clientes.",

    Pagos:
      "Configura y revisa tus métodos de cobro.",

    Ajustes:
      "Personaliza información y configuración de la tienda.",
  };

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div>
          <Link
            className="admin-brand"
            href="/"
          >
            <span className="admin-brand-mark">
              [ ]
            </span>

            <span>
              <b>
                POKEAMIGOS
              </b>

              <small>
                ADMIN
              </small>
            </span>
          </Link>

          <div className="admin-sidebar-label">
            Panel
          </div>

          <nav className="admin-nav">
            {tabs.map(
              (item) => (
                <button
                  type="button"
                  key={
                    item.name
                  }
                  className={
                    tab ===
                    item.name
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setTab(
                      item.name as TabName
                    )
                  }
                >
                  <span className="admin-nav-icon">
                    {
                      item.icon
                    }
                  </span>

                  <span>
                    {
                      item.name
                    }
                  </span>

                  <i>
                    →
                  </i>
                </button>
              )
            )}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <Link
            href="/"
            className="admin-view-store"
          >
            <span>
              ↗
            </span>

            Ver tienda
          </Link>

          <div className="admin-profile">
            {identity.avatarUrl ? (
              <span
                className="admin-profile-avatar"
                style={{
                  backgroundImage:
                    `url("${identity.avatarUrl}")`,
                }}
              />
            ) : (
              <span className="admin-profile-avatar admin-profile-fallback">
                {identity.name
                  .slice(
                    0,
                    1
                  )
                  .toUpperCase()}
              </span>
            )}

            <div>
              <b>
                {
                  identity.name
                }
              </b>

              <small>
                {identity.email ||
                  "Administrador"}
              </small>
            </div>

            <button
              type="button"
              title="Cerrar sesión"
              onClick={
                signOut
              }
            >
              ↪
            </button>
          </div>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-top">
          <div>
            <span className="admin-eyebrow">
              PANEL DE CONTROL
            </span>

            <h1>
              {tab}
            </h1>

            <p>
              {
                tabDescription[
                  tab
                ]
              }
            </p>
          </div>

          <div className="admin-top-actions">
            <Link
              href="/"
              className="admin-preview-button"
            >
              Vista previa
              ↗
            </Link>

            <button
              className="publish"
              type="button"
              onClick={() =>
                save(
                  "Cambios guardados"
                )
              }
            >
              <span>
                ✓
              </span>

              Guardar cambios
            </button>
          </div>
        </header>

        <div className="admin-content">
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
            <AdminMediaManager
              save={save}
            />
          )}

          {tab ===
            "Pedidos" && (
            <Orders />
          )}

          {tab ===
            "Pagos" && (
            <Payments
              save={
                save
              }
            />
          )}

          {tab ===
            "Ajustes" && (
            <Settings
              save={
                save
              }
            />
          )}
        </div>
      </section>

      {saved && (
        <output className="admin-toast">
          <span>
            ✓
          </span>

          {saved}
        </output>
      )}
    </main>
  );
}

function Overview({
  setTab,
}: {
  setTab: (
    value: TabName
  ) => void;
}) {
  return (
    <>
      <section className="metrics">
        <article className="metric-card metric-primary">
          <div className="metric-icon">
            $
          </div>

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
          <div className="metric-icon">
            □
          </div>

          <small>
            Pedidos
            pendientes
          </small>

          <strong>
            03
          </strong>

          <span>
            Requieren
            revisión
          </span>
        </article>

        <article>
          <div className="metric-icon">
            ◇
          </div>

          <small>
            Productos
            publicados
          </small>

          <strong>
            12
          </strong>

          <span>
            3 catálogos
            activos
          </span>
        </article>
      </section>

      <section className="admin-grid">
        <article className="admin-card wide admin-quick-card">
          <div className="card-heading">
            <div>
              <p>
                Acciones rápidas
              </p>

              <h2>
                ¿Qué quieres
                administrar?
              </h2>
            </div>

            <span className="card-badge">
              POKEAMIGOS
            </span>
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
              <span className="quick-icon">
                ＋
              </span>

              <div>
                <b>
                  Añadir producto
                </b>

                <small>
                  Catálogo,
                  precio y stock
                </small>
              </div>

              <i>
                →
              </i>
            </button>

            <button
              type="button"
              onClick={() =>
                setTab(
                  "Imágenes"
                )
              }
            >
              <span className="quick-icon">
                ▣
              </span>

              <div>
                <b>
                  Multimedia
                </b>

                <small>
                  Portadas y
                  logos
                </small>
              </div>

              <i>
                →
              </i>
            </button>

            <button
              type="button"
              onClick={() =>
                setTab(
                  "Usuarios"
                )
              }
            >
              <span className="quick-icon">
                ◎
              </span>

              <div>
                <b>
                  Usuarios
                </b>

                <small>
                  Cuentas
                  registradas
                </small>
              </div>

              <i>
                →
              </i>
            </button>
          </div>
        </article>

        <article className="admin-card launch-card">
          <div className="card-heading">
            <div>
              <p>
                Estado
              </p>

              <h2>
                Lanzamiento
              </h2>
            </div>

            <strong className="launch-percentage">
              50%
            </strong>
          </div>

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
              Publicar
              inventario
            </li>
          </ol>
        </article>
      </section>

      <section className="admin-card admin-welcome-card">
        <div>
          <span>
            TIENDA
          </span>

          <h2>
            Pokeamigos está
            tomando forma.
          </h2>

          <p>
            Desde aquí puedes
            administrar la
            identidad visual,
            catálogo y clientes
            sin salir del panel.
          </p>
        </div>

        <Link href="/">
          Abrir tienda
          <span>
            ↗
          </span>
        </Link>
      </section>
    </>
  );
}

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

      setLoading(
        false
      );

      return;
    }

    const client =
      supabase;

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
            Comunidad
          </p>

          <h2>
            Usuarios
            registrados
          </h2>
        </div>

        <div className="users-count">
          <span>
            Total
          </span>

          <b>
            {users.length}
          </b>
        </div>
      </div>

      {loading && (
        <div className="admin-empty-state">
          <span className="admin-mini-loader" />

          <p>
            Cargando
            usuarios…
          </p>
        </div>
      )}

      {!loading &&
        error && (
          <div className="admin-error-state">
            <b>
              No pudimos cargar
              los usuarios.
            </b>

            <span>
              {error}
            </span>
          </div>
        )}

      {!loading &&
        !error &&
        users.length ===
          0 && (
          <div className="admin-empty-state">
            <span>
              ◎
            </span>

            <b>
              Aún no hay
              usuarios.
            </b>

            <p>
              Las cuentas nuevas
              aparecerán aquí.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        users.length >
          0 && (
          <div className="users-table-wrap">
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
                const name =
                  user.full_name ||
                  user.email
                    ?.split(
                      "@"
                    )[0] ||
                  "Sin nombre";

                const initial =
                  name
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
                              `url("${user.avatar_url}")`,
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
                        {name}
                      </b>
                    </div>

                    <span className="user-email">
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

                    <span className="user-date">
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

function Payments({
  save,
}: {
  save: (
    value: string
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
            utilizarás en
            Pokeamigos.
          </span>
        </div>

        <b>
          PREPARACIÓN
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
              className="payment-card"
              key={name}
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
                  {subtitle}
                </p>

                <small>
                  {detail}
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
                Configurar

                <span>
                  →
                </span>
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

      <section className="payment-checklist">
        <div>
          <p>
            Antes de cobrar
          </p>

          <h3>
            Checklist de
            lanzamiento
          </h3>
        </div>

        <ul>
          <li>
            Cuenta de negocio
            verificada.
          </li>

          <li>
            Políticas de la
            tienda publicadas.
          </li>

          <li>
            Cuenta bancaria
            configurada.
          </li>

          <li>
            Compra de prueba
            completada.
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
          <p>
            Operación
          </p>

          <h2>
            Pedidos
          </h2>
        </div>

        <button
          type="button"
          className="admin-outline-button"
        >
          Exportar
          <span>
            ↓
          </span>
        </button>
      </div>

      <div className="orders-table">
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

              <em
                className={
                  index ===
                  0
                    ? "order-pending"
                    : "order-draft"
                }
              >
                {index ===
                0
                  ? "Pendiente"
                  : "Borrador"}
              </em>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function Settings({
  save,
}: {
  save: (
    value: string
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

  const saveIntro =
    () => {
      localStorage.setItem(
        "tcg-home-intro",
        homeIntro.trim()
      );

      save(
        "Texto de inicio actualizado"
      );
    };

  return (
    <section className="settings">
      <article className="admin-card">
        <div className="settings-card-icon">
          ◇
        </div>

        <p>
          Datos de tienda
        </p>

        <h3>
          Información
          principal
        </h3>

        <label>
          Nombre visible

          <input
            defaultValue="Pokeamigos"
            placeholder="Pokeamigos"
          />
        </label>

        <label>
          Correo de
          atención

          <input
            type="email"
            placeholder="correo@pokeamigos.com"
          />
        </label>

        <button
          className="primary-action"
          type="button"
          onClick={() =>
            save(
              "Datos guardados"
            )
          }
        >
          Guardar datos
        </button>
      </article>

      <article className="admin-card">
        <div className="settings-card-icon">
          ✦
        </div>

        <p>
          Página principal
        </p>

        <h3>
          Mensaje de
          bienvenida
        </h3>

        <label>
          Texto

          <textarea
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
            maxLength={
              120
            }
            placeholder="Cartas, comunidad y grandes hallazgos."
          />
        </label>

        <div className="settings-counter">
          {
            homeIntro.length
          }
          /120
        </div>

        <button
          className="primary-action"
          type="button"
          onClick={
            saveIntro
          }
        >
          Guardar texto
        </button>
      </article>

      <article className="admin-card settings-legal-card">
        <div className="settings-card-icon">
          §
        </div>

        <p>
          Legal
        </p>

        <h3>
          Envíos y
          políticas
        </h3>

        <span>
          Revisa la
          información legal
          visible para tus
          clientes.
        </span>

        <div className="settings-links">
          <Link href="/politica-de-privacidad">
            Privacidad
            <b>↗</b>
          </Link>

          <Link href="/terminos-y-condiciones">
            Términos
            <b>↗</b>
          </Link>

          <Link href="/politica-de-envios">
            Envíos
            <b>↗</b>
          </Link>
        </div>
      </article>
    </section>
  );
}