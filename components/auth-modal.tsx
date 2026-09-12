"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { supabase } from "@/lib/supabase";

import styles from "./auth-modal.module.css";

type AuthMode =
  | "login"
  | "register";

type AuthModalProps = {
  open: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
};

export function AuthModal({
  open,
  initialMode = "login",
  onClose,
}: AuthModalProps) {
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
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] =
    useState<
      "success" | "error"
    >("error");

  useEffect(() => {
    if (!open) {
      return;
    }

    setMode(
      initialMode
    );

    setMessage("");

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
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [
    open,
    initialMode,
    onClose,
  ]);

  const switchMode = (
    nextMode:
      AuthMode
  ) => {
    setMode(
      nextMode
    );

    setMessage("");

    setPassword("");

    setConfirmPassword(
      ""
    );
  };

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
            .signInWithPassword(
              {
                email:
                  email.trim(),

                password,
              }
            );

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
            onClose();
          },
          450
        );
      } finally {
        setLoading(
          false
        );
      }
    };

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

          window.setTimeout(
            () => {
              onClose();
            },
            650
          );
        } else {
          setMessage(
            "Cuenta creada. Revisa tu correo para confirmar el registro."
          );
        }
      } finally {
        setLoading(
          false
        );
      }
    };

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
        setLoading(
          false
        );

        setMessageType(
          "error"
        );

        setMessage(
          error.message
        );
      }
    };

  if (!open) {
    return null;
  }

  return (
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
        onClick={
          onClose
        }
        aria-label="Cerrar ventana"
      />

      <section
        className={
          styles.modal
        }
      >
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
            onClick={
              onClose
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
    </div>
  );
}