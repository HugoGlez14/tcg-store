"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Tcg = "pokemon" | "riftbound" | "yugioh";
type Product = { id: string; name: string; tcg: Tcg; category: string; description: string | null; condition: string; price_mxn: number; stock: number; status: "draft" | "published" | "archived" };
const labels: Record<Tcg, string> = { pokemon: "Pokémon", riftbound: "Riftbound", yugioh: "Yu-Gi-Oh!" };
const empty = { name: "", tcg: "pokemon" as Tcg, category: "Expansiones", description: "", condition: "Nuevo / sellado", price: "", stock: "0", status: "draft" };

export function ProductManager() {
  const [items, setItems] = useState<Product[]>([]);
  const [draft, setDraft] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const load = async () => { const { data, error } = await supabase!.from("products").select("*").order("created_at", { ascending: false }); if (error) setMessage(error.message); else setItems((data || []) as Product[]); };
  useEffect(() => { load(); }, []);
  const set = (key: keyof typeof empty, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const slugBase = draft.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const row = { name: draft.name.trim(), tcg: draft.tcg, category: draft.category, description: draft.description.trim() || null, condition: draft.condition, price_mxn: Number(draft.price || 0), stock: Number(draft.stock || 0), status: draft.status, ...(editing ? {} : { slug: `${slugBase}-${Date.now().toString().slice(-6)}` }) };
    const { error } = editing ? await supabase!.from("products").update(row).eq("id", editing) : await supabase!.from("products").insert(row);
    if (error) { setMessage(error.message); return; }
    setMessage(editing ? "Producto actualizado." : "Producto guardado."); setEditing(null); setDraft(empty); load();
  };
  const edit = (item: Product) => { setEditing(item.id); setDraft({ name: item.name, tcg: item.tcg, category: item.category, description: item.description || "", condition: item.condition, price: String(item.price_mxn), stock: String(item.stock), status: item.status }); };
  const remove = async (id: string) => { if (!window.confirm("¿Eliminar este producto?")) return; const { error } = await supabase!.from("products").delete().eq("id", id); setMessage(error ? error.message : "Producto eliminado."); load(); };
  return <><section className="admin-card product-list"><div className="card-heading"><div><p>Inventario conectado</p><h2>Productos cargados</h2></div><button className="add-product" onClick={() => { setEditing(null); setDraft(empty); }}>＋ Agregar</button></div><div className="product-row product-row-head"><span>Producto</span><span>TCG</span><span>Stock</span><span>Estado</span><span>Acciones</span></div>{items.map((item) => <div className="product-row" key={item.id}><b>{item.name}</b><span>{labels[item.tcg]}</span><span>{item.stock}</span><em className={item.status === "published" ? "published" : "draft"}>{item.status === "published" ? "Publicado" : "Borrador"}</em><div><button className="mini-edit" onClick={() => edit(item)}>Editar</button><button className="mini-delete" onClick={() => remove(item.id)}>Eliminar</button></div></div>)}</section><form className="product-editor" onSubmit={submit}><div className="editor-header"><div><p>{editing ? "Editar producto" : "Nuevo producto"}</p><h2>{editing ? draft.name || "Producto" : "Información y publicación"}</h2></div></div><div className="editor-grid"><section className="form-panel"><label>Nombre del producto<input value={draft.name} onChange={(e) => set("name", e.target.value)} required /></label><div className="form-row"><label>Juego<select value={draft.tcg} onChange={(e) => set("tcg", e.target.value)}><option value="pokemon">Pokémon</option><option value="riftbound">Riftbound</option><option value="yugioh">Yu-Gi-Oh!</option></select></label><label>Categoría<input value={draft.category} onChange={(e) => set("category", e.target.value)} /></label></div><div className="form-row"><label>Precio MXN<input value={draft.price} onChange={(e) => set("price", e.target.value)} inputMode="decimal" required /></label><label>Inventario<input value={draft.stock} onChange={(e) => set("stock", e.target.value)} inputMode="numeric" required /></label></div><label>Descripción<textarea value={draft.description} onChange={(e) => set("description", e.target.value)} /></label><label>Estado<select value={draft.status} onChange={(e) => set("status", e.target.value)}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label><div className="form-buttons"><button className="secondary" type="button" onClick={() => { setEditing(null); setDraft(empty); }}>Cancelar</button><button className="primary-action" type="submit">Guardar producto</button></div></section><section className="upload-panel"><p>Galería</p><div className="dropzone"><strong>Guarda el producto primero</strong><span>Las imágenes se habilitan tras guardar el artículo.</span></div></section></div></form>{message && <output className="admin-toast">{message}</output>}</>;
}
