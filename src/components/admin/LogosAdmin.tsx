import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload, Pencil, Check, X, Plus } from "lucide-react";

interface LogoItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  images?: LogoImage[];
}

interface LogoImage {
  id: string;
  logo_id: string;
  image_url: string;
  display_order: number;
}

const InlineEditor = ({ item, onUpdate }: { item: LogoItem; onUpdate: () => void }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);

  const save = async () => {
    const { error } = await supabase.from("logos").update({ title: title.trim(), description: description.trim() }).eq("id", item.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setEditing(false);
    onUpdate();
  };

  if (editing) {
    return (
      <div className="space-y-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre de la marca" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="En qué me basé..." className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <div className="flex gap-2">
          <button onClick={save} className="text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
          <button onClick={() => { setEditing(false); setTitle(item.title); setDescription(item.description); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-start justify-between gap-2">
        <p className="font-display text-sm font-semibold">{item.title}</p>
        <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground shrink-0"><Pencil className="w-3 h-3" /></button>
      </div>
      {item.description ? (
        <p className="text-xs text-muted-foreground italic">{item.description}</p>
      ) : (
        <p className="text-xs text-muted-foreground/60">Sin descripción</p>
      )}
    </div>
  );
};

const LogosAdmin = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<LogoItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mockupFiles, setMockupFiles] = useState<File[]>([]);
  const logoRef = useRef<HTMLInputElement>(null);
  const mockupsRef = useRef<HTMLInputElement>(null);
  const MAX_MOCKUPS = 6;

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data: logos } = await supabase.from("logos").select("*").order("display_order", { ascending: true });
    const { data: images } = await supabase.from("logo_images").select("*").order("display_order", { ascending: true });
    const merged = ((logos as LogoItem[]) || []).map((l) => ({
      ...l,
      images: ((images as LogoImage[]) || []).filter((im) => im.logo_id === l.id),
    }));
    setItems(merged);
  };

  const handleUpload = async () => {
    if (!logoFile || !title.trim()) {
      toast({ title: "Error", description: "Subí el logo principal y escribí el nombre de la marca.", variant: "destructive" });
      return;
    }
    if (mockupFiles.length > MAX_MOCKUPS) {
      toast({ title: "Máximo excedido", description: `Podés subir hasta ${MAX_MOCKUPS} mockups.`, variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const uploadOne = async (file: File) => {
        const ext = file.name.split(".").pop();
        const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(path);
        return urlData.publicUrl;
      };
      const [logoUrl, ...mockupUrls] = await Promise.all([
        uploadOne(logoFile),
        ...mockupFiles.map((f) => uploadOne(f)),
      ]);
      const uploaded = [logoUrl, ...mockupUrls];
      const { data: logoRow, error } = await supabase.from("logos").insert({
        user_id: userId,
        title: title.trim(),
        description: description.trim(),
        image_url: uploaded[0],
        display_order: items.length,
      }).select().single();
      if (error) throw error;
      if (logoRow) {
        const rows = uploaded.map((url, idx) => ({ logo_id: (logoRow as any).id, image_url: url, display_order: idx }));
        const { error: imgErr } = await supabase.from("logo_images").insert(rows);
        if (imgErr) throw imgErr;
      }
      toast({ title: "¡Subido!", description: "Logo agregado." });
      setTitle("");
      setDescription("");
      setLogoFile(null);
      setMockupFiles([]);
      if (logoRef.current) logoRef.current.value = "";
      if (mockupsRef.current) mockupsRef.current.value = "";
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const addImagesTo = async (item: LogoItem, files: FileList) => {
    try {
      const current = item.images?.length ?? 0;
      const remaining = MAX_MOCKUPS + 1 - current; // +1 because logo counts as slot 0
      if (files.length > remaining) {
        toast({ title: "Máximo excedido", description: `Solo podés agregar ${Math.max(remaining, 0)} imagen(es) más (máx. ${MAX_MOCKUPS} mockups + logo).`, variant: "destructive" });
        return;
      }
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const ext = file.name.split(".").pop();
          const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file);
          if (upErr) throw upErr;
          const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(path);
          return urlData.publicUrl;
        })
      );
      const start = item.images?.length ?? 0;
      const rows = uploaded.map((url, idx) => ({ logo_id: item.id, image_url: url, display_order: start + idx }));
      const { error } = await supabase.from("logo_images").insert(rows);
      if (error) throw error;
      toast({ title: "Agregado", description: `${uploaded.length} mockup(s) añadido(s).` });
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const deleteImage = async (img: LogoImage) => {
    try {
      const parts = img.image_url.split("/portfolio/");
      await supabase.storage.from("portfolio").remove([parts[parts.length - 1]]);
      const { error } = await supabase.from("logo_images").delete().eq("id", img.id);
      if (error) throw error;
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (item: LogoItem) => {
    try {
      const urls = [item.image_url, ...((item.images || []).map((i) => i.image_url))].filter(Boolean);
      const paths = Array.from(new Set(urls)).map((u) => {
        const parts = u.split("/portfolio/");
        return parts[parts.length - 1];
      });
      if (paths.length) await supabase.storage.from("portfolio").remove(paths);
      const { error } = await supabase.from("logos").delete().eq("id", item.id);
      if (error) throw error;
      toast({ title: "Eliminado", description: "Logo eliminado." });
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold">Logos</h2>

      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
        <h3 className="font-display text-sm font-semibold">Agregar nueva marca</h3>
        <Input placeholder="Nombre de la marca" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          placeholder="En qué me basé para llegar a este logo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">Logo principal (obligatorio)</label>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            {logoFile ? `✓ Seleccionado: ${logoFile.name}` : "El logo o isotipo suelto que se muestra primero."}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">
            Mockups (opcional · {mockupFiles.length}/{MAX_MOCKUPS} seleccionados)
          </label>
          <input
            ref={mockupsRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const picked = Array.from(e.target.files || []);
              if (picked.length === 0) return;
              setMockupFiles((prev) => {
                const combined = [...prev, ...picked].slice(0, MAX_MOCKUPS);
                if (prev.length + picked.length > MAX_MOCKUPS) {
                  toast({ title: "Máximo alcanzado", description: `Se guardaron ${combined.length} de ${MAX_MOCKUPS} mockups.` });
                }
                return combined;
              });
              if (mockupsRef.current) mockupsRef.current.value = "";
            }}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Tarjetas, packaging, etiquetas, cartas, etc. En el móvil el selector suele dejar una sola: repetí "Elegir archivo" y se van sumando (hasta {MAX_MOCKUPS}).
          </p>
          {mockupFiles.length > 0 && (
            <ul className="mt-2 space-y-1">
              {mockupFiles.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-xs bg-background/50 border border-border/50 rounded px-2 py-1">
                  <span className="truncate">{i + 1}. {f.name}</span>
                  <button
                    type="button"
                    onClick={() => setMockupFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    aria-label="Quitar"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button onClick={handleUpload} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" /> {uploading ? "Subiendo..." : `Subir marca${mockupFiles.length ? ` (1 logo + ${mockupFiles.length} mockups)` : ""}`}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay logos subidos aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border/50 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 gap-1 p-2 bg-background/50">
                {(item.images && item.images.length > 0 ? item.images : [{ id: "cover", logo_id: item.id, image_url: item.image_url, display_order: 0 } as LogoImage]).map((img) => (
                  <div key={img.id} className="relative aspect-square bg-background rounded-md overflow-hidden group">
                    <img src={img.image_url} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-contain p-1" />
                    {img.id !== "cover" && (
                      <button
                        onClick={() => deleteImage(img)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-1"
                        aria-label="Eliminar mockup"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 space-y-3">
                <InlineEditor item={item} onUpdate={fetchItems} />
                <label className="flex items-center gap-2 text-xs cursor-pointer text-primary hover:text-primary/80">
                  <Plus className="w-3 h-3" /> Añadir mockups
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && addImagesTo(item, e.target.files)}
                  />
                </label>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive w-full" onClick={() => handleDelete(item)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogosAdmin;