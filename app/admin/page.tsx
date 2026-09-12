"use client";

import "./admin.css";
import "./admin-enhancements.css";
import "./admin-auth-unified.css";

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

  created_at:
    string;
};

export default function AdminPage() {
  const [
    tab,
    setTab,
  ] =
    useState(
      "Resumen"
    );

  const [
    saved,
    setSaved,
  ] =
    useState("");

  const [
    accessState,
    setAccessState,
  ] =
    useState<
      | "loading"
      | "setup"
      | "login"
      | "denied"
      | "allowed"
    >("loading");

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

          return;
        }

        const {
          data:
            profile,

          error:
            profileError,
        } =
          await client
            .from(
              "profiles"
            )
            .select(
              "role"
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
    message:
      string
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

      window.location.href =
        "/";
    };

  if (
    accessState ===
    "loading"
  ) {
    return (
      <main className="admin-access-page">
        <section className="admin-access-card">
          <span className="admin-access-kicker">
            POKEAMIGOS
          </span>

          <h1>
            Verificando
            acceso…
          </h1>

          <p>
            Estamos
            comprobando tu
            sesión y permisos
            de administrador.
          </p>
        </section>
      </main>
    );
  }

  if (
    accessState ===
    "setup"
  ) {
    return (
      <main className="admin-access-page">
        <section className="admin-access-card">
          <span className="admin-access-kicker">
            CONFIGURACIÓN
          </span>

          <h1>
            Supabase no está
            configurado.
          </h1>

          <p>
            Revisa las
            variables de
            entorno de
            Supabase en el
            proyecto.
          </p>

          <Link
            className="admin-access-button"
            href="/"
          >
            Volver a la
            tienda
          </Link>
        </section>
      </main>
    );
  }

  if (
    accessState ===
    "login"
  ) {
    return (
      <main className="admin-access-page">
        <section className="admin-access-card">
          <span className="admin-access-kicker">
            ACCESO PRIVADO
          </span>

          <h1>
            Primero inicia
            sesión.
          </h1>

          <p>
            Pokeamigos utiliza
            una sola sesión
            para clientes y
            administradores.
            Inicia sesión desde
            la tienda y vuelve
            al panel.
          </p>

          <Link
            className="admin-access-button"
            href="/"
          >
            Ir a Pokeamigos
          </Link>
        </section>
      </main>
    );
  }

  if (
    accessState ===
    "denied"
  ) {
    return (
      <main className="admin-access-page">
        <section className="admin-access-card">
          <div className="admin-access-icon">
            !
          </div>

          <span className="admin-access-kicker">
            SIN PERMISOS
          </span>

          <h1>
            Tu cuenta no es
            administrador.
          </h1>

          <p>
            Tu sesión funciona,
            pero tu perfil tiene
            rol de cliente.
            Solamente una cuenta
            con rol administrador
            puede abrir este
            panel.
          </p>

          <Link
            className="admin-access-button"
            href="/"
          >
            Volver a la
            tienda
          </Link>

          <button
            type="button"
            className="admin-access-button admin-access-secondary"
            onClick={
              signOut
            }
          >
            Cerrar sesión
          </button>
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
            POKEAMIGOS
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
                key={
                  item
                }
                className={
                  tab ===
                  item
                    ? "selected"
                    : ""
                }
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

          <button
            className="admin-sign-out"
            type="button"
            onClick={
              signOut
            }
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-top">
          <div>
            <p>
              Panel de control
            </p>

            <h1>
              {tab}
            </h1>
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
          <Users
            save={
              save
            }
          />
        )}

        {tab ===
          "Imágenes" && (
          <AdminMediaManager
            save={
              save
            }
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
  setTab: (
    value:
      string
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
              portadas y logos
            </button>

            <button
              type="button"
              onClick={() =>
                setTab(
                  "Ajustes"
                )
              }
            >
              ⚙ Ajustes de tienda
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

function Users({
  save,
}: {
  save: (
    value:
      string
  ) => void;
}) {
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
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    changingRole,
    setChangingRole,
  ] =
    useState<
      string | null
    >(null);

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

          setUsers(
            []
          );
        } else {
          setUsers(
            (data ??
              []) as
              UserProfile[]
          );

          setError(
            ""
          );
        }

        setLoading(
          false
        );
      };

    loadUsers();
  }, []);

  const updateRole =
    async (
      userId:
        string,

      role:
        | "admin"
        | "customer"
    ) => {
      if (!supabase) {
        return;
      }

      setChangingRole(
        userId
      );

      const {
        error:
          updateError,
      } =
        await supabase
          .from(
            "profiles"
          )
          .update({
            role,
          })
          .eq(
            "id",
            userId
          );

      setChangingRole(
        null
      );

      if (
        updateError
      ) {
        console.error(
          "Error cambiando rol:",
          updateError
        );

        window.alert(
          `No se pudo cambiar el rol: ${updateError.message}`
        );

        return;
      }

      setUsers(
        (current) =>
          current.map(
            (user) =>
              user.id ===
              userId
                ? {
                    ...user,
                    role,
                  }
                : user
          )
      );

      save(
        role ===
        "admin"
          ? "Usuario convertido en administrador"
          : "Usuario convertido en cliente"
      );
    };

  return (
    <section className="admin-card users-panel">
      <div className="card-heading">
        <div>
          <p>
            Clientes registrados
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
            {error}
          </p>
        )}

      {!loading &&
        !error &&
        users.length ===
          0 && (
          <p className="users-message">
            Todavía no hay
            usuarios registrados.
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

                    <span>
                      {user.email ||
                        "Sin correo"}
                    </span>

                    <select
                      className={`role-selector ${
                        user.role ===
                        "admin"
                          ? "role-admin-select"
                          : "role-customer-select"
                      }`}
                      value={
                        user.role
                      }
                      disabled={
                        changingRole ===
                        user.id
                      }
                      onChange={(
                        event
                      ) =>
                        updateRole(
                          user.id,

                          event
                            .target
                            .value as
                            | "admin"
                            | "customer"
                        )
                      }
                    >
                      <option value="customer">
                        Cliente
                      </option>

                      <option value="admin">
                        Administrador
                      </option>
                    </select>

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

function Payments({
  save,
}: {
  save: (
    value:
      string
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
            los métodos que usarás
            en tu tienda.
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
              key={
                name
              }
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
    </section>
  );
}

function Orders() {
  return (
    <section className="admin-card orders">
      <div className="card-heading">
        <div>
          <p>
            Pedidos
          </p>

          <h2>
            Revisión de pedidos
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
            key={
              order
            }
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

function Settings({
  save,
}: {
  save: (
    value:
      string
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
        <p>
          Datos de la tienda
        </p>

        <label>
          Nombre visible

          <input
            placeholder="Pokeamigos"
          />
        </label>

        <label>
          Correo de atención

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
        <p>
          Página principal
        </p>

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
                event.target
                  .value
              )
            }
            maxLength={
              120
            }
            placeholder="Cartas, comunidad y grandes hallazgos."
          />
        </label>

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

      <article className="admin-card">
        <p>
          Envíos y políticas
        </p>

        <span>
          Revisa la información
          legal visible para tus
          clientes.
        </span>

        <Link
          className="secondary"
          href="/politica-de-envios"
        >
          Política de envíos
        </Link>
      </article>
    </section>
  );
}