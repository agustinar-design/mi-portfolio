import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload, Plus, X, Pencil, Check } from "lucide-react";

interface BeforeAfterImage {
  id: string;
  image_url: string;
  image_type: "before" | "after";
  display_order: number;
}

interface BeforeAfterItem {
  id: string;
  brand_name: string;
  description: string;
  display_order: number;
  images: BeforeAfterImage[];
}

const InlineDescriptionEditor = ({ itemId, currentDescription, onUpdate }: { itemId: string; currentDescription: string; onUpdate: () => void }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentDescription);

  const save = async () => {
    const { error } = await supabase.from("before_after_items").update({ description: value.trim() }).eq("id", itemId);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setEditing(false);
    onUpdate();
  };

  if (editing) {
    return (
      <div className="flex gap-2 items-start">
        <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={2} className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
        <button onClick={save} className="text-primary hover:text-primary/80"><Check className="w-4 h-4" /></button>
        <button onClick={() => { setEditing(false); setValue(currentDescription); }} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
    );
  }

  return (
    <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
      <Pencil className="w-3 h-3" />
      {currentDescription ? <span className="italic">{currentDescription}</span> : <span>Agregar descripción</span>}
    </button>
  );
};

const BeforeAfterAdmin = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<BeforeAfterItem[]>([]);
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles, setAfterFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data: itemsData } = await supabase
      .from("before_after_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (!itemsData) return;

    const { data: imagesData } = await supabase
      .from("before_after_images")
      .select("*")
      .order("display_order", { ascending: true });

    const images = (imagesData || []) as BeforeAfterImage[];

    const enriched: BeforeAfterItem[] = (itemsData as any[]).map((item) => ({
      id: item.id,
      brand_name: item.brand_name,
      description: item.description || "",
      display_order: item.display_order,
      images: images.filter((img: any) => img.item_id === item.id),
    }));

    setItems(enriched);
  };

  const uploadFile = async (file: File, prefix: string) => {
    const ext = file.name.split(".").pop();
    const path = `before-after/${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleAddFiles = (type: "before" | "after", files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    if (type === "before") {
      setBeforeFiles((prev) => [...prev, ...arr]);
    } else {
      setAfterFiles((prev) => [...prev, ...arr]);
    }
  };

  const removeFile = (type: "before" | "after", index: number) => {
    if (type === "before") {
      setBeforeFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAfterFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleUpload = async () => {
    if (beforeFiles.length === 0 && afterFiles.length === 0) {
      toast({ title: "Error", description: "Subí al menos una imagen.", variant: "destructive" });
      return;
    }
    if (!brandName.trim()) {
      toast({ title: "Error", description: "Escribí el nombre de la marca.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      // Create the parent item
      const { data: newItem, error: itemError } = await supabase
        .from("before_after_items")
        .insert({
          user_id: userId,
          brand_name: brandName.trim(),
          description: description.trim(),
          before_image_url: "",
          after_image_url: "",
          display_order: items.length,
        })
        .select()
        .single();

      if (itemError || !newItem) throw itemError || new Error("No se pudo crear el item");

      // Upload all files in parallel
      const uploadPromises = [
        ...beforeFiles.map(async (file, i) => {
          const url = await uploadFile(file, "before");
          return { item_id: newItem.id, image_url: url, image_type: "before" as const, display_order: i };
        }),
        ...afterFiles.map(async (file, i) => {
          const url = await uploadFile(file, "after");
          return { item_id: newItem.id, image_url: url, image_type: "after" as const, display_order: i };
        }),
      ];

      const imageRecords = await Promise.all(uploadPromises);

      if (imageRecords.length > 0) {
        const { error: imgError } = await supabase.from("before_after_images").insert(imageRecords);
        if (imgError) throw imgError;
      }

      toast({ title: "¡Subido!", description: `${imageRecords.length} imagen(es) agregadas.` });
      setBrandName("");
      setDescription("");
      setBeforeFiles([]);
      setAfterFiles([]);
      if (beforeRef.current) beforeRef.current.value = "";
      if (afterRef.current) afterRef.current.value = "";
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const handleDeleteItem = async (item: BeforeAfterItem) => {
    try {
      // Delete images from storage
      const paths = item.images.map((img) => {
        const parts = img.image_url.split("/portfolio/");
        return parts[parts.length - 1];
      });
      if (paths.length > 0) {
        await supabase.storage.from("portfolio").remove(paths);
      }
      // Cascade will delete child images
      const { error } = await supabase.from("before_after_items").delete().eq("id", item.id);
      if (error) throw error;
      toast({ title: "Eliminado", description: "Antes y después eliminado." });
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteImage = async (image: BeforeAfterImage) => {
    try {
      const parts = image.image_url.split("/portfolio/");
      await supabase.storage.from("portfolio").remove([parts[parts.length - 1]]);
      const { error } = await supabase.from("before_after_images").delete().eq("id", image.id);
      if (error) throw error;
      toast({ title: "Eliminado", description: "Imagen eliminada." });
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleAddImageToItem = async (itemId: string, type: "before" | "after", files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploads = Array.from(files).map(async (file, i) => {
        const url = await uploadFile(file, type);
        return { item_id: itemId, image_url: url, image_type: type, display_order: i };
      });
      const records = await Promise.all(uploads);
      const { error } = await supabase.from("before_after_images").insert(records);
      if (error) throw error;
      toast({ title: "¡Subido!", description: `${records.length} imagen(es) agregadas.` });
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold">Antes y Después</h2>

      {/* Upload new item */}
      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
        <h3 className="font-display text-sm font-semibold">Agregar nuevo</h3>
        <Input
          placeholder="Nombre de la marca o empresa"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <textarea
          placeholder="Descripción del resultado (ej: De feed sin identidad visual a contenido alineado con marca...)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Before files */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-display">Imágenes ANTES</label>
            <input
              ref={beforeRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => { handleAddFiles("before", e.target.files); e.target.value = ""; }}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            {beforeFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {beforeFiles.map((f, i) => (
                  <span key={i} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    {f.name.slice(0, 20)}
                    <button onClick={() => removeFile("before", i)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* After files */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-display">Imágenes DESPUÉS</label>
            <input
              ref={afterRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => { handleAddFiles("after", e.target.files); e.target.value = ""; }}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            {afterFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {afterFiles.map((f, i) => (
                  <span key={i} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    {f.name.slice(0, 20)}
                    <button onClick={() => removeFile("after", i)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <Button onClick={handleUpload} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" /> {uploading ? "Subiendo..." : "Subir"}
        </Button>
      </div>

      {/* Existing items */}
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay antes y después subidos aún.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => {
            const beforeImgs = item.images.filter((img) => img.image_type === "before");
            const afterImgs = item.images.filter((img) => img.image_type === "after");
            return (
              <div key={item.id} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm font-semibold">{item.brand_name}</p>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteItem(item)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <InlineDescriptionEditor itemId={item.id} currentDescription={item.description} onUpdate={fetchItems} />
                </div>
                <div className="grid grid-cols-2 gap-4 px-4 pb-4">
                  {/* Before column */}
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-display">Antes ({beforeImgs.length})</span>
                    <div className="grid grid-cols-2 gap-2">
                      {beforeImgs.map((img) => (
                        <div key={img.id} className="relative group">
                          <img src={img.image_url} alt="Antes" className="w-full h-24 object-cover rounded-lg" />
                          <button
                            onClick={() => handleDeleteImage(img)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center gap-1 text-xs text-primary cursor-pointer hover:underline">
                      <Plus className="w-3 h-3" /> Agregar
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleAddImageToItem(item.id, "before", e.target.files)} />
                    </label>
                  </div>
                  {/* After column */}
                  <div className="space-y-2">
                    <span className="text-xs text-primary font-display">Después ({afterImgs.length})</span>
                    <div className="grid grid-cols-2 gap-2">
                      {afterImgs.map((img) => (
                        <div key={img.id} className="relative group">
                          <img src={img.image_url} alt="Después" className="w-full h-24 object-cover rounded-lg" />
                          <button
                            onClick={() => handleDeleteImage(img)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center gap-1 text-xs text-primary cursor-pointer hover:underline">
                      <Plus className="w-3 h-3" /> Agregar
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleAddImageToItem(item.id, "after", e.target.files)} />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BeforeAfterAdmin;
