"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  supabase,
} from "@/lib/supabase";

import styles from "./auth-modal.module.css";

type AuthMode =
  | "login"
  | "register";

type AuthModalProps = {
  open: boolean;

  initialMode?:
    AuthMode;

  onClose: () => void;
};

export function AuthModal({
  open,
  initialMode = "login",
  onClose,
}: AuthModalProps) {
  const [
    mounted,
    setMounted,
  ] =
    useState(false);

  const [
    mode,
    setMode,
  ] =
    useState<AuthMode>(
      initialMode
    );

  const [
    fullName,
    setFullName,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    messageType,
    setMessageType,
  ] =
    useState<
      "success" | "error"
    >("error");

  /*
   * Guardamos onClose en un ref.
   *
   * Así el efecto principal no se
   * vuelve a ejecutar únicamente
   * porque el componente padre
   * creó otra función onClose.
   */
  const onCloseRef =
    useRef(onClose);

  /*
   * Nos permite detectar cuando
   * el modal acaba de pasar de
   * cerrado -> abierto.
   */
  const wasOpenRef =
    useRef(false);

  useEffect(() => {
    onCloseRef.current =
      onClose;
  }, [onClose]);

  /*
   * Next.js:
   * createPortal necesita
   * document.body.
   */
  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  /*
   * IMPORTANTE:
   *
   * Solo restablecemos la pestaña
   * cuando el modal ACABA DE ABRIR.
   *
   * No lo hacemos en cada render.
   */
  useEffect(() => {
    if (
      open &&
      !wasOpenRef.current
    ) {
      setMode(
        initialMode
      );

      setMessage("");

      setLoading(
        false
      );
    }

    wasOpenRef.current =
      open;
  }, [
    open,
    initialMode,
  ]);

  /*
   * Bloquear scroll de la página
   * y cerrar con ESC.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    const onKeyDown = (
      event:
        KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onCloseRef.current();
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [open]);

  /*
   * Cambiar entre:
   *
   * Iniciar sesión
   * Crear cuenta
   */
  const switchMode = (
    nextMode:
      AuthMode
  ) => {
    setMode(
      nextMode
    );

    setMessage("");

    /*
     * Limpiamos únicamente
     * contraseñas.
     *
     * Conservamos correo para que
     * si el usuario escribió su correo
     * y cambia de pestaña no tenga
     * que volverlo a escribir.
     */
    setPassword("");

    setConfirmPassword("");
  };

  /*
   * ==========================
   * INICIAR SESIÓN
   * ==========================
   */
  const signIn =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      if (!supabase) {
        setMessageType(
          "error"
        );

        setMessage(
          "Supabase no está configurado."
        );

        return;
      }

      setLoading(true);

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
          "Sesión iniciada correctamente."
        );

        window.setTimeout(
          () => {
            onCloseRef.current();
          },
          450
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * ==========================
   * CREAR CUENTA
   * ==========================
   */
  const signUp =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      if (!supabase) {
        setMessageType(
          "error"
        );

        setMessage(
          "Supabase no está configurado."
        );

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
        password.length <
        8
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

      setLoading(true);

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
                  window.location
                    .origin,

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

        setMessageType(
          "success"
        );

        if (
          data.session
        ) {
          setMessage(
            "Cuenta creada correctamente."
          );

          /*
           * Si Supabase inicia sesión
           * automáticamente, cerramos
           * después de mostrar éxito.
           */
          window.setTimeout(
            () => {
              onCloseRef.current();
            },
            650
          );
        } else {
          /*
           * Si requiere confirmación
           * por correo, NO cambiamos
           * automáticamente a login.
           *
           * El usuario verá el mensaje.
           */
          setMessage(
            "Cuenta creada. Revisa tu correo para confirmar el registro."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  /*
   * ==========================
   * GOOGLE
   * ==========================
   */
  const signInGoogle =
    async () => {
      if (!supabase) {
        setMessageType(
          "error"
        );

        setMessage(
          "Supabase no está configurado."
        );

        return;
      }

      setLoading(true);

      setMessage("");

      const {
        error,
      } =
        await supabase.auth
          .signInWithOAuth({
            provider:
              "google",

            options: {
              redirectTo:
                window.location
                  .origin,
            },
          });

      if (error) {
        setLoading(false);

        setMessageType(
          "error"
        );

        setMessage(
          error.message
        );
      }
    };

  if (
    !mounted ||
    !open
  ) {
    return null;
  }

  return createPortal(
    <div
      className={
        styles.layer
      }
    >
      <button
        type="button"
        className={
          styles.backdrop
        }
        onClick={() =>
          onCloseRef.current()
        }
        aria-label="Cerrar ventana"
      />

      <section
        className={
          styles.modal
        }
        role="dialog"
        aria-modal="true"
        aria-label={
          mode ===
          "login"
            ? "Iniciar sesión"
            : "Crear cuenta"
        }
      >
        {/* ======================
            LADO IZQUIERDO
        ====================== */}

        <aside
          className={
            styles.visual
          }
        >
          <div
            className={
              styles.brand
            }
          >
            <span>
              [ ]
            </span>

            <b>
              POKEAMIGOS
            </b>
          </div>

          <div
            className={
              styles.visualCopy
            }
          >
            <small>
              TU CUENTA
            </small>

            <h2>
              Todo tu
              universo
              <br />

              en un solo
              lugar.
            </h2>

            <p>
              Inicia sesión
              para comprar,
              guardar tu
              carrito y
              disfrutar de
              Pokeamigos.
            </p>
          </div>

          <div
            className={
              styles.visualCards
            }
          >
            <article>
              <b>
                01
              </b>

              <span>
                Pokémon
              </span>
            </article>

            <article>
              <b>
                02
              </b>

              <span>
                Riftbound
              </span>
            </article>

            <article>
              <b>
                03
              </b>

              <span>
                Yu-Gi-Oh!
              </span>
            </article>
          </div>
        </aside>

        {/* ======================
            LADO DERECHO
        ====================== */}

        <div
          className={
            styles.formSide
          }
        >
          <button
            type="button"
            className={
              styles.close
            }
            onClick={() =>
              onCloseRef.current()
            }
            aria-label="Cerrar"
          >
            ×
          </button>

          <div
            className={
              styles.mobileBrand
            }
          >
            <span>
              [ ]
            </span>

            <b>
              POKEAMIGOS
            </b>
          </div>

          {/* ======================
              TABS
          ====================== */}

          <div
            className={
              styles.tabs
            }
          >
            <button
              type="button"
              className={
                mode ===
                "login"
                  ? styles.active
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
                  ? styles.active
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

          <header
            className={
              styles.heading
            }
          >
            <small>
              {mode ===
              "login"
                ? "BIENVENIDO DE NUEVO"
                : "NUEVA CUENTA"}
            </small>

            <h1>
              {mode ===
              "login"
                ? "Hola de nuevo."
                : "Únete a Pokeamigos."}
            </h1>

            <p>
              {mode ===
              "login"
                ? "Inicia sesión con tu correo o utiliza tu cuenta de Google."
                : "Regístrate con correo o utiliza Google. Todas las cuentas comienzan como clientes."}
            </p>
          </header>

          {/* ======================
              LOGIN
          ====================== */}

          {mode ===
          "login" ? (
            <form
              className={
                styles.form
              }
              onSubmit={
                signIn
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
                className={
                  styles.mainButton
                }
                type="submit"
                disabled={
                  loading
                }
              >
                {loading
                  ? "Entrando…"
                  : "Iniciar sesión"}
              </button>
            </form>
          ) : (
            /* ======================
               REGISTRO
            ====================== */

            <form
              className={
                styles.form
              }
              onSubmit={
                signUp
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

              <div
                className={
                  styles.passwordRow
                }
              >
                <label>
                  <span>
                    Contraseña
                  </span>

                  <input
                    type="password"
                    minLength={
                      8
                    }
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
                    minLength={
                      8
                    }
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
                    placeholder="Repetir"
                    autoComplete="new-password"
                    required
                  />
                </label>
              </div>

              <button
                className={
                  styles.mainButton
                }
                type="submit"
                disabled={
                  loading
                }
              >
                {loading
                  ? "Creando cuenta…"
                  : "Crear cuenta"}
              </button>
            </form>
          )}

          {/* ======================
              GOOGLE
          ====================== */}

          <div
            className={
              styles.divider
            }
          >
            <span>
              o continúa
              con
            </span>
          </div>

          <button
            type="button"
            className={
              styles.googleButton
            }
            onClick={
              signInGoogle
            }
            disabled={
              loading
            }
          >
            <span>
              G
            </span>

            Continuar con Google
          </button>

          {/* ======================
              MENSAJES
          ====================== */}

          {message && (
            <div
              className={`${styles.feedback} ${
                messageType ===
                "success"
                  ? styles.success
                  : styles.error
              }`}
            >
              {message}
            </div>
          )}

          <p
            className={
              styles.help
            }
          >
            Al continuar
            aceptas los
            términos y
            políticas de
            Pokeamigos.
          </p>
        </div>
      </section>
    </div>,
    document.body
  );
}