"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  tcg: string;
  price: number | null;
  stock: number | null;
  quantity: number;
};

type AddItemInput = Omit<CartItem, "quantity">;

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  hasUnpricedItems: boolean;

  addItem: (
    item: AddItemInput,
    quantity?: number
  ) => void;

  updateQuantity: (
    id: string,
    quantity: number
  ) => void;

  removeItem: (
    id: string
  ) => void;

  clearCart: () => void;
};

const STORAGE_KEY =
  "pokeamigos-cart-v1";

const CartContext =
  createContext<CartContextValue | null>(
    null
  );

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    items,
    setItems,
  ] =
    useState<CartItem[]>([]);

  const [
    hydrated,
    setHydrated,
  ] =
    useState(false);

  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      if (saved) {
        const parsed =
          JSON.parse(
            saved
          ) as CartItem[];

        if (
          Array.isArray(
            parsed
          )
        ) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error(
        "No se pudo cargar el carrito:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        items
      )
    );
  }, [
    items,
    hydrated,
  ]);

  const addItem = (
    item: AddItemInput,
    quantity = 1
  ) => {
    setItems(
      (current) => {
        const existing =
          current.find(
            (line) =>
              line.id ===
              item.id
          );

        const maxStock =
          item.stock &&
          item.stock > 0
            ? item.stock
            : null;

        if (existing) {
          const nextQuantity =
            existing.quantity +
            quantity;

          return current.map(
            (line) =>
              line.id ===
              item.id
                ? {
                    ...line,
                    ...item,

                    quantity:
                      maxStock
                        ? Math.min(
                            nextQuantity,
                            maxStock
                          )
                        : nextQuantity,
                  }
                : line
          );
        }

        return [
          ...current,

          {
            ...item,

            quantity:
              maxStock
                ? Math.min(
                    quantity,
                    maxStock
                  )
                : quantity,
          },
        ];
      }
    );
  };

  const removeItem = (
    id: string
  ) => {
    setItems(
      (current) =>
        current.filter(
          (line) =>
            line.id !== id
        )
    );
  };

  const updateQuantity = (
    id: string,
    quantity: number
  ) => {
    if (
      quantity <= 0
    ) {
      removeItem(id);
      return;
    }

    setItems(
      (current) =>
        current.map(
          (line) => {
            if (
              line.id !== id
            ) {
              return line;
            }

            const maxStock =
              line.stock &&
              line.stock > 0
                ? line.stock
                : null;

            return {
              ...line,

              quantity:
                maxStock
                  ? Math.min(
                      quantity,
                      maxStock
                    )
                  : quantity,
            };
          }
        )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value =
    useMemo<CartContextValue>(
      () => {
        const totalItems =
          items.reduce(
            (
              total,
              item
            ) =>
              total +
              item.quantity,
            0
          );

        const totalAmount =
          items.reduce(
            (
              total,
              item
            ) =>
              total +
              (item.price ??
                0) *
                item.quantity,
            0
          );

        return {
          items,

          totalItems,

          totalAmount,

          hasUnpricedItems:
            items.some(
              (item) =>
                item.price ===
                null
            ),

          addItem,

          updateQuantity,

          removeItem,

          clearCart,
        };
      },
      [items]
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider."
    );
  }

  return context;
}