"use client";

import Link from "next/link";
import {
  useState,
  type FormEvent,
} from "react";

import { supabase } from "@/lib/supabase";

type AccessState =
  | "loading"
  | "setup"
  | "login"
  | "denied";

type AuthMode =
  | "login"
  | "register";

type Props = {
  accessState: AccessState;
  onSignOut?: () => Promise<void>;
};

export function AdminAuthPanel({
  accessState,
  onSignOut,
}: Props) {
  const [
    mode,
    setMode,
  ] = useState<AuthMode>(
    "login"
  );

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] = useState<
    "error" | "success"
  >("error");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const resetMessage = () => {
    setMessage("");
  };

  const switchMode = (
    nextMode: AuthMode
  ) => {
    setMode(nextMode);
    resetMessage();

    setPassword("");
    setConfirmPassword("");
  };

  const login = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const {
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email:
              email.trim(),
            password,
          });

      if (error) {
        setMessageType(
          "error"
        );

        setMessage(
          error.message
        );

        return;
      }

      setMessageType(
        "success"
      );

      setMessage(
        "Acceso correcto. Verificando permisos…"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const register = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    if (
      fullName.trim()
        .length < 2
    ) {
      setMessageType(
        "error"
      );

      setMessage(
        "Escribe tu nombre."
      );

      return;
    }

    if (
      password.length < 8
    ) {
      setMessageType(
        "error"
      );

      setMessage(
        "La contraseña debe tener al menos 8 caracteres."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setMessageType(
        "error"
      );

      setMessage(
        "Las contraseñas no coinciden."
      );

      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const {
        data,
        error,
      } =
        await supabase.auth
          .signUp({
            email:
              email.trim(),

            password,

            options: {
              emailRedirectTo:
                window.location.origin,

              data: {
                full_name:
                  fullName.trim(),
              },
            },
          });

      if (error) {
        setMessageType(
          "error"
        );

        setMessage(
          error.message
        );

        return;
      }

      /*
       * Si Supabase tiene desactivada
       * la confirmación por correo,
       * signUp puede iniciar sesión
       * automáticamente.
       *
       * Cerramos esa sesión para que
       * un cliente nuevo no intente
       * entrar al administrador.
       */
      if (data.session) {
        await supabase.auth
          .signOut();
      }

      setMessageType(
        "success"
      );

      setMessage(
        "Cuenta creada. Si tu proyecto requiere confirmación, revisa tu correo. Después podrás iniciar sesión."
      );

      setFullName("");
      setPassword("");
      setConfirmPassword("");

      setMode("login");
    } finally {
      setSubmitting(false);
    }
  };

  const google = async () => {
    if (!supabase) {
      return;
    }

    setSubmitting(true);

    const redirectTo =
      mode === "login"
        ? `${window.location.origin}/admin`
        : window.location.origin;

    const {
      error,
    } =
      await supabase.auth
        .signInWithOAuth({
          provider:
            "google",

          options: {
            redirectTo,
          },
        });

    if (error) {
      setSubmitting(false);

      setMessageType(
        "error"
      );

      setMessage(
        error.message
      );
    }
  };

  if (
    accessState ===
    "loading"
  ) {
    return (
      <main className="admin-auth-page">
        <div className="admin-auth-loader">
          <div className="admin-auth-loader-mark">
            <span />
            <span />
            <span />
          </div>

          <b>
            POKEAMIGOS
          </b>

          <p>
            Verificando tu
            sesión…
          </p>

          <div className="admin-auth-loader-line">
            <i />
          </div>
        </div>
      </main>
    );
  }

  if (
    accessState ===
    "setup"
  ) {
    return (
      <main className="admin-auth-page">
        <section className="admin-auth-card admin-auth-message-card">
          <div className="auth-brand">
            <span>
              [ ]
            </span>

            <b>
              POKEAMIGOS
            </b>
          </div>

          <span className="auth-kicker">
            Configuración
          </span>

          <h1>
            Falta conectar
            Supabase.
          </h1>

          <p>
            Configura las
            variables de entorno
            para habilitar el
            acceso administrativo.
          </p>

          <Link
            href="/"
            className="auth-main-button"
          >
            Volver a la tienda
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
      <main className="admin-auth-page">
        <section className="admin-auth-card admin-auth-message-card">
          <div className="auth-brand">
            <span>
              [ ]
            </span>

            <b>
              POKEAMIGOS
            </b>
          </div>

          <div className="auth-status-icon">
            !
          </div>

          <span className="auth-kicker">
            Acceso restringido
          </span>

          <h1>
            Esta cuenta no es
            administrador.
          </h1>

          <p>
            Tu sesión funciona,
            pero el panel de
            administración requiere
            el rol{" "}
            <strong>
              admin
            </strong>.
          </p>

          <div className="auth-message-actions">
            <Link
              href="/"
              className="auth-main-button"
            >
              Ir a Pokeamigos
            </Link>

            {onSignOut && (
              <button
                type="button"
                className="auth-secondary-button"
                onClick={
                  onSignOut
                }
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-shell">
        <aside className="admin-auth-promo">
          <Link
            href="/"
            className="auth-brand auth-brand-light"
          >
            <span>
              [ ]
            </span>

            <b>
              POKEAMIGOS
            </b>
          </Link>

          <div className="auth-promo-copy">
            <span>
              PANEL DE CONTROL
            </span>

            <h2>
              Tu tienda,
              <br />
              bajo control.
            </h2>

            <p>
              Productos,
              colecciones,
              usuarios,
              imágenes y pedidos
              desde un solo lugar.
            </p>
          </div>

          <div className="auth-promo-cards">
            <article>
              <strong>
                01
              </strong>

              <span>
                Catálogo
              </span>

              <small>
                Administra
                productos
              </small>
            </article>

            <article>
              <strong>
                02
              </strong>

              <span>
                Multimedia
              </span>

              <small>
                Logos y portadas
              </small>
            </article>

            <article>
              <strong>
                03
              </strong>

              <span>
                Clientes
              </span>

              <small>
                Usuarios
                registrados
              </small>
            </article>
          </div>

          <small className="auth-promo-footer">
            Administración privada
            · Pokeamigos
          </small>
        </aside>

        <section className="admin-auth-form-side">
          <div className="auth-mobile-brand">
            <span>
              [ ]
            </span>

            <b>
              POKEAMIGOS
            </b>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={
                mode ===
                "login"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchMode(
                  "login"
                )
              }
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              className={
                mode ===
                "register"
                  ? "active"
                  : ""
              }
              onClick={() =>
                switchMode(
                  "register"
                )
              }
            >
              Crear cuenta
            </button>
          </div>

          <div className="auth-form-heading">
            <span>
              {mode === "login"
                ? "BIENVENIDO DE NUEVO"
                : "ÚNETE A POKEAMIGOS"}
            </span>

            <h1>
              {mode === "login"
                ? "Inicia sesión."
                : "Crea tu cuenta."}
            </h1>

            <p>
              {mode === "login"
                ? "Ingresa con tu cuenta autorizada para administrar la tienda."
                : "Tu cuenta nueva se registrará como cliente. El acceso al administrador requiere permisos adicionales."}
            </p>
          </div>

          {mode ===
          "login" ? (
            <form
              className="admin-auth-form"
              onSubmit={
                login
              }
            >
              <label>
                <span>
                  Correo
                </span>

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
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                <span>
                  Contraseña
                </span>

                <input
                  type="password"
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
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </label>

              <button
                className="auth-main-button"
                type="submit"
                disabled={
                  submitting
                }
              >
                {submitting
                  ? "Entrando…"
                  : "Entrar al panel"}
              </button>
            </form>
          ) : (
            <form
              className="admin-auth-form"
              onSubmit={
                register
              }
            >
              <label>
                <span>
                  Nombre
                </span>

                <input
                  type="text"
                  value={
                    fullName
                  }
                  onChange={(
                    event
                  ) =>
                    setFullName(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Tu nombre"
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                <span>
                  Correo
                </span>

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
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  required
                />
              </label>

              <div className="auth-form-row">
                <label>
                  <span>
                    Contraseña
                  </span>

                  <input
                    type="password"
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
                    minLength={8}
                    placeholder="8+ caracteres"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label>
                  <span>
                    Confirmar
                  </span>

                  <input
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={(
                      event
                    ) =>
                      setConfirmPassword(
                        event
                          .target
                          .value
                      )
                    }
                    minLength={8}
                    placeholder="Repite contraseña"
                    autoComplete="new-password"
                    required
                  />
                </label>
              </div>

              <button
                className="auth-main-button"
                type="submit"
                disabled={
                  submitting
                }
              >
                {submitting
                  ? "Creando cuenta…"
                  : "Crear cuenta"}
              </button>
            </form>
          )}

          <div className="auth-divider">
            <span>
              o continúa con
            </span>
          </div>

          <button
            className="auth-google-button"
            type="button"
            onClick={
              google
            }
            disabled={
              submitting
            }
          >
            <span className="google-g">
              G
            </span>

            {mode === "login"
              ? "Continuar con Google"
              : "Registrarme con Google"}
          </button>

          {message && (
            <div
              className={`auth-feedback ${
                messageType
              }`}
            >
              {message}
            </div>
          )}

          <Link
            className="auth-store-link"
            href="/"
          >
            ← Volver a la
            tienda
          </Link>
        </section>
      </section>
    </main>
  );
}