import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Upload, LogOut, ArrowLeft } from "lucide-react";
import { staticPortfolioItems, categoryLabels, type Category, type StaticPortfolioItem } from "@/data/staticPortfolioItems";
import BeforeAfterAdmin from "@/components/admin/BeforeAfterAdmin";
import SortablePortfolioList, { type SortablePortfolioItem } from "@/components/admin/SortablePortfolioList";

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

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeTab, setActiveTab] = useState<Category>("images");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const [orderMap, setOrderMap] = useState<Record<string, number>>({});
  const [isSavingOrder, setIsSavingOrder] = useState(false);
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

  useEffect(() => { fetchItems(); }, [activeTab]);
  useEffect(() => { fetchHiddenKeys(); fetchOrders(); }, []);

  const fetchHiddenKeys = async () => {
    const { data } = await supabase.from("hidden_static_items").select("item_key");
    if (data) setHiddenKeys(new Set(data.map((d: any) => d.item_key)));
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("static_item_orders").select("item_key, display_order");
    if (data) {
      const map: Record<string, number> = {};
      data.forEach((d: any) => { map[d.item_key] = d.display_order; });
      setOrderMap(map);
    }
  };

  const fetchItems = async () => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("category", activeTab)
      .order("display_order", { ascending: true });
    setItems(data || []);
  };

  // Build ordered list for current category
  const buildOrderedList = (): SortablePortfolioItem[] => {
    const staticItems: SortablePortfolioItem[] = staticPortfolioItems[activeTab].map((item) => ({
      key: item.key,
      title: item.title,
      description: item.description,
      image: item.image,
      video: item.video,
      type: "static" as const,
      isHidden: hiddenKeys.has(item.key),
    }));

    const dbOrderedItems: SortablePortfolioItem[] = items.map((item) => ({
      key: `db-${item.id}`,
      title: item.title,
      description: item.description,
      ...(item.file_type === "video" ? { video: item.file_url } : { image: item.file_url }),
      type: "db" as const,
      dbId: item.id,
    }));

    const all = [...staticItems, ...dbOrderedItems];
    all.sort((a, b) => {
      const oa = orderMap[a.key] ?? 9999;
      const ob = orderMap[b.key] ?? 9999;
      return oa - ob;
    });
    return all;
  };

  const orderedList = buildOrderedList();

  const saveOrder = async (newList: SortablePortfolioItem[]) => {
    const previousMap = orderMap;
    const upserts = newList.map((item, i) => ({
      item_key: item.key,
      display_order: i,
    }));

    const nextMap = upserts.reduce<Record<string, number>>((acc, item) => {
      acc[item.item_key] = item.display_order;
      return acc;
    }, {});

    setOrderMap((prev) => ({ ...prev, ...nextMap }));
    setIsSavingOrder(true);

    const { error } = await supabase.from("static_item_orders").upsert(upserts, { onConflict: "item_key" });
    
    if (error) {
      setOrderMap(previousMap);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setIsSavingOrder(false);
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

  const handleHideStatic = async (key: string) => {
    const { error } = await supabase.from("hidden_static_items").insert({ item_key: key });
    if (!error) {
      setHiddenKeys((prev) => new Set([...prev, key]));
      toast({ title: "Oculto", description: "El contenido ya no se muestra en el portfolio." });
    }
  };

  const handleShowStatic = async (key: string) => {
    const { error } = await supabase.from("hidden_static_items").delete().eq("item_key", key);
    if (!error) {
      setHiddenKeys((prev) => { const n = new Set(prev); n.delete(key); return n; });
      toast({ title: "Visible", description: "El contenido se muestra nuevamente." });
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
              className={`px-5 py-2 font-display text-sm rounded-md transition-all duration-300 ${activeTab === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
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
          <input ref={fileRef} type="file" accept="image/*,video/*" className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer" />
          <Button onClick={handleUpload} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" /> {uploading ? "Subiendo..." : "Subir"}
          </Button>
        </div>

        {/* Before & After */}
        <BeforeAfterAdmin userId={user.id} />

        {/* Reorder section */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold">
            Ordenar galería – {categoryLabels[activeTab]}
          </h2>
          <p className="text-muted-foreground text-xs">
            Arrastrá desde el ícono de puntos para reordenar. {isSavingOrder ? "Guardando cambios..." : "El orden se guarda automáticamente y se mantiene en tu portfolio público."}
          </p>

          <SortablePortfolioList
            items={orderedList}
            onReorder={saveOrder}
            onToggleStaticVisibility={(item) => item.isHidden ? handleShowStatic(item.key) : handleHideStatic(item.key)}
            onDeleteDbItem={(dbId) => {
              const item = items.find((entry) => entry.id === dbId);
              if (item) void handleDelete(item);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
