import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload, Pencil, Check, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { pieceTypeLabels } from "@/components/PapeleriaSection";

interface PapeleriaItem {
  id: string;
  title: string;
  description: string;
  piece_type: string;
  image_url: string;
  display_order: number;
}

const typeKeys = Object.keys(pieceTypeLabels);

const InlineEditor = ({ item, onUpdate }: { item: PapeleriaItem; onUpdate: () => void }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [pieceType, setPieceType] = useState(item.piece_type);

  const save = async () => {
    const { error } = await supabase
      .from("papeleria_items")
      .update({ title: title.trim(), description: description.trim(), piece_type: pieceType })
      .eq("id", item.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setEditing(false);
    onUpdate();
  };

  if (editing) {
    return (
      <div className="space-y-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre de la pieza" />
        <select
          value={pieceType}
          onChange={(e) => setPieceType(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {typeKeys.map((k) => (
            <option key={k} value={k}>{pieceTypeLabels[k]}</option>
          ))}
        </select>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Descripción..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex gap-2">
          <button onClick={save} className="text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
          <button
            onClick={() => { setEditing(false); setTitle(item.title); setDescription(item.description); setPieceType(item.piece_type); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-start justify-between gap-2">
        <p className="font-display text-sm font-semibold">{item.title}</p>
        <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground shrink-0">
          <Pencil className="w-3 h-3" />
        </button>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-primary/80">
        {pieceTypeLabels[item.piece_type] ?? item.piece_type}
      </p>
      {item.description ? (
        <p className="text-xs text-muted-foreground italic">{item.description}</p>
      ) : (
        <p className="text-xs text-muted-foreground/60">Sin descripción</p>
      )}
    </div>
  );
};

const SortableCard = ({
  item,
  onDelete,
  onUpdate,
}: {
  item: PapeleriaItem;
  onDelete: (item: PapeleriaItem) => void;
  onUpdate: () => void;
}) => {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, willChange: "transform", zIndex: isDragging ? 50 : undefined, position: "relative" }}
      className={`bg-card border rounded-xl overflow-hidden transition-colors ${isDragging ? "border-primary/50 shadow-2xl" : "border-border/50"}`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-background/40">
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label="Arrastrar para reordenar"
          className="flex h-8 w-8 shrink-0 touch-none items-center justify-center rounded-lg border border-border/60 bg-secondary/40 text-muted-foreground hover:border-primary/30 hover:text-primary cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-xs text-muted-foreground truncate ml-2">{item.title}</span>
      </div>
      <div className="aspect-square bg-background/50 p-2">
        <img src={item.image_url} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-contain" />
      </div>
      <div className="p-4 space-y-3">
        <InlineEditor item={item} onUpdate={onUpdate} />
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive w-full" onClick={() => onDelete(item)}>
          <Trash2 className="w-4 h-4 mr-2" /> Eliminar
        </Button>
      </div>
    </div>
  );
};

const PapeleriaAdmin = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<PapeleriaItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pieceType, setPieceType] = useState("tarjetas");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase
      .from("papeleria_items")
      .select("*")
      .order("display_order", { ascending: true });
    setItems((data as PapeleriaItem[]) || []);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleUpload = async () => {
    const files = Array.from(fileRef.current?.files || []);
    if (files.length === 0 || !title.trim()) {
      toast({ title: "Error", description: "Elegí al menos un archivo y escribí un nombre.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const ext = file.name.split(".").pop();
          const path = `papeleria/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file);
          if (upErr) throw upErr;
          return supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
        })
      );
      const rows = uploaded.map((url, i) => ({
        user_id: userId,
        title: files.length > 1 ? `${title.trim()} ${i + 1}` : title.trim(),
        description: description.trim(),
        piece_type: pieceType,
        image_url: url,
        display_order: items.length + i,
      }));
      const { error } = await supabase.from("papeleria_items").insert(rows);
      if (error) throw error;
      toast({ title: "¡Subido!", description: `${rows.length} pieza(s) agregada(s).` });
      setTitle("");
      setDescription("");
      if (fileRef.current) fileRef.current.value = "";
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const handleDelete = async (item: PapeleriaItem) => {
    try {
      const parts = item.image_url.split("/portfolio/");
      await supabase.storage.from("portfolio").remove([parts[parts.length - 1]]);
      const { error } = await supabase.from("papeleria_items").delete().eq("id", item.id);
      if (error) throw error;
      toast({ title: "Eliminado", description: "Pieza eliminada." });
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const persistOrder = async (ordered: PapeleriaItem[]) => {
    setItems(ordered);
    const results = await Promise.all(
      ordered.map((it, idx) => supabase.from("papeleria_items").update({ display_order: idx }).eq("id", it.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      toast({ title: "Error guardando orden", description: failed.error.message, variant: "destructive" });
      fetchItems();
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    persistOrder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold">Papelería</h2>

      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
        <h3 className="font-display text-sm font-semibold">Agregar pieza</h3>
        <Input placeholder="Nombre de la pieza (ej. Tarjetas Impronta)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select
          value={pieceType}
          onChange={(e) => setPieceType(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {typeKeys.map((k) => (
            <option key={k} value={k}>{pieceTypeLabels[k]}</option>
          ))}
        </select>
        <textarea
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
        />
        <Button onClick={handleUpload} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" /> {uploading ? "Subiendo..." : "Subir"}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay piezas de papelería aún.</p>
      ) : (
        <>
          <p className="text-muted-foreground text-xs">Arrastrá desde el ícono de puntos para reordenar. El orden se guarda automáticamente.</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <SortableCard key={item.id} item={item} onDelete={handleDelete} onUpdate={fetchItems} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
};

export default PapeleriaAdmin;
