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
  const fileRef = useRef<HTMLInputElement>(null);

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
    const files = fileRef.current?.files;
    if (!files || files.length === 0 || !title.trim()) {
      toast({ title: "Error", description: "Seleccioná al menos una imagen y escribí el nombre de la marca.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(path);
        uploaded.push(urlData.publicUrl);
      }
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
      if (fileRef.current) fileRef.current.value = "";
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const addImagesTo = async (item: LogoItem, files: FileList) => {
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("portfolio").upload(path, file);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(path);
        uploaded.push(urlData.publicUrl);
      }
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
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
        />
        <p className="text-xs text-muted-foreground">Podés seleccionar varios mockups (logo suelto, tarjetas, cajas, etc.)</p>
        <Button onClick={handleUpload} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" /> {uploading ? "Subiendo..." : "Subir marca"}
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
                    <img src={img.image_url} alt={item.title} className="w-full h-full object-contain p-1" />
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