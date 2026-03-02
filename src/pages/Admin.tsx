import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload, LogOut, ArrowLeft } from "lucide-react";

type Category = "basic" | "elaborate" | "video";

interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  display_order: number;
  created_at: string;
}

const categoryLabels: Record<Category, string> = {
  basic: "Ediciones Simples",
  elaborate: "Contenido +Visual",
  video: "Videos Para Las Redes",
};

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeTab, setActiveTab] = useState<Category>("basic");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/login");
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/login");
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("category", activeTab)
      .order("display_order", { ascending: true });
    setItems(data || []);
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !title) {
      toast({ title: "Error", description: "Seleccioná un archivo y escribí un título.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${activeTab}/${Date.now()}.${ext}`;
    const isVideo = file.type.startsWith("video/");

    const { error: uploadError } = await supabase.storage.from("portfolio").upload(path, file);
    if (uploadError) {
      toast({ title: "Error subiendo archivo", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(path);

    const { error: insertError } = await supabase.from("portfolio_items").insert({
      user_id: user.id,
      category: activeTab,
      title,
      description,
      file_url: urlData.publicUrl,
      file_type: isVideo ? "video" : "image",
      display_order: items.length,
    });

    if (insertError) {
      toast({ title: "Error guardando", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "¡Subido!", description: "Archivo agregado al portfolio." });
      setTitle("");
      setDescription("");
      if (fileRef.current) fileRef.current.value = "";
      fetchItems();
    }
    setUploading(false);
  };

  const handleDelete = async (item: PortfolioItem) => {
    // Extract storage path from URL
    const urlParts = item.file_url.split("/portfolio/");
    const storagePath = urlParts[urlParts.length - 1];

    await supabase.storage.from("portfolio").remove([storagePath]);
    const { error } = await supabase.from("portfolio_items").delete().eq("id", item.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Eliminado", description: "Archivo eliminado del portfolio." });
      fetchItems();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Cargando...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-xl font-bold">Panel de Admin</h1>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Salir
        </Button>
      </header>

      <div className="container py-8 px-6 max-w-4xl mx-auto space-y-8">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 font-display text-sm rounded-md transition-all duration-300 ${
                activeTab === cat
                  ? "bg-primary text-primary-foreground glow-violet-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Upload form */}
        <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Subir nuevo archivo</h2>
          <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
          <Button onClick={handleUpload} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" /> {uploading ? "Subiendo..." : "Subir"}
          </Button>
        </div>

        {/* Items list */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold">
            {categoryLabels[activeTab]} ({items.length})
          </h2>
          {items.length === 0 && (
            <p className="text-muted-foreground text-sm">No hay archivos subidos en esta categoría aún.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card border border-border/50 rounded-xl overflow-hidden group">
                <div className="aspect-square bg-black/30 flex items-center justify-center p-2">
                  {item.file_type === "video" ? (
                    <video src={item.file_url} controls className="max-w-full max-h-full object-contain rounded-lg" preload="metadata" />
                  ) : (
                    <img src={item.file_url} alt={item.title} className="max-w-full max-h-full object-contain rounded-lg" loading="lazy" />
                  )}
                </div>
                <div className="p-4 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold truncate">{item.title}</p>
                    {item.description && <p className="text-muted-foreground text-xs truncate">{item.description}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
