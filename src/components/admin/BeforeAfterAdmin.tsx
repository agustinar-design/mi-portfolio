import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload } from "lucide-react";

interface BeforeAfterItem {
  id: string;
  brand_name: string;
  before_image_url: string;
  after_image_url: string;
  display_order: number;
}

const BeforeAfterAdmin = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<BeforeAfterItem[]>([]);
  const [brandName, setBrandName] = useState("");
  const [uploading, setUploading] = useState(false);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("before_after_items")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setItems(data as BeforeAfterItem[]);
  };

  const uploadFile = async (file: File, prefix: string) => {
    const ext = file.name.split(".").pop();
    const path = `before-after/${prefix}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleUpload = async () => {
    const beforeFile = beforeRef.current?.files?.[0];
    const afterFile = afterRef.current?.files?.[0];

    if (!beforeFile || !afterFile || !brandName.trim()) {
      toast({ title: "Error", description: "Completá el nombre de marca y las dos imágenes.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const [beforeUrl, afterUrl] = await Promise.all([
        uploadFile(beforeFile, "before"),
        uploadFile(afterFile, "after"),
      ]);

      const { error } = await supabase.from("before_after_items").insert({
        user_id: userId,
        brand_name: brandName.trim(),
        before_image_url: beforeUrl,
        after_image_url: afterUrl,
        display_order: items.length,
      });

      if (error) throw error;

      toast({ title: "¡Subido!", description: "Antes y después agregado." });
      setBrandName("");
      if (beforeRef.current) beforeRef.current.value = "";
      if (afterRef.current) afterRef.current.value = "";
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const handleDelete = async (item: BeforeAfterItem) => {
    try {
      const extractPath = (url: string) => {
        const parts = url.split("/portfolio/");
        return parts[parts.length - 1];
      };
      await supabase.storage.from("portfolio").remove([
        extractPath(item.before_image_url),
        extractPath(item.after_image_url),
      ]);
      const { error } = await supabase.from("before_after_items").delete().eq("id", item.id);
      if (error) throw error;
      toast({ title: "Eliminado", description: "Antes y después eliminado." });
      fetchItems();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold">Antes y Después</h2>

      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
        <h3 className="font-display text-sm font-semibold">Agregar nuevo</h3>
        <Input
          placeholder="Nombre de la marca o empresa"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-display">Imagen ANTES</label>
            <input
              ref={beforeRef}
              type="file"
              accept="image/*"
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-display">Imagen DESPUÉS</label>
            <input
              ref={afterRef}
              type="file"
              accept="image/*"
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
          </div>
        </div>
        <Button onClick={handleUpload} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" /> {uploading ? "Subiendo..." : "Subir"}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay antes y después subidos aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border/50 rounded-xl overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <p className="font-display text-sm font-semibold">{item.brand_name}</p>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Antes</span>
                  <img src={item.before_image_url} alt="Antes" className="w-full h-32 object-cover rounded-lg" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-primary">Después</span>
                  <img src={item.after_image_url} alt="Después" className="w-full h-32 object-cover rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BeforeAfterAdmin;
