import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface SortablePortfolioItem {
  key: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  type: "static" | "db";
  dbId?: string;
  isHidden?: boolean;
}

interface SortablePortfolioListProps {
  items: SortablePortfolioItem[];
  onReorder: (items: SortablePortfolioItem[]) => void | Promise<void>;
  onToggleStaticVisibility: (item: SortablePortfolioItem) => void;
  onDeleteDbItem: (dbId: string) => void;
}

interface SortableRowProps {
  item: SortablePortfolioItem;
  onToggleStaticVisibility: (item: SortablePortfolioItem) => void;
  onDeleteDbItem: (dbId: string) => void;
}

const SortableRow = ({ item, onToggleStaticVisibility, onDeleteDbItem }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.key });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex items-center gap-3 rounded-2xl border p-3 transition-all duration-200 ${
        isDragging
          ? "border-primary/40 bg-card/95 shadow-2xl backdrop-blur-xl"
          : item.isHidden
            ? "border-destructive/30 bg-card/50 opacity-50"
            : "border-border/50 bg-card/80"
      }`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label="Arrastrar para reordenar"
        className="flex h-10 w-10 shrink-0 touch-none items-center justify-center rounded-xl border border-border/60 bg-secondary/40 text-muted-foreground transition-colors duration-200 hover:border-primary/30 hover:text-primary cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-background/40">
        {item.video ? (
          <video src={item.video} className="h-full w-full object-cover" preload="metadata" muted />
        ) : (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold">{item.title}</p>
        <p className="truncate text-xs text-muted-foreground">{item.description}</p>
        {item.isHidden && <span className="font-display text-[10px] uppercase tracking-wider text-destructive">Oculto</span>}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {item.type === "static" && (
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${item.isHidden ? "text-primary" : "text-destructive"}`}
            onClick={() => onToggleStaticVisibility(item)}
            title={item.isHidden ? "Mostrar" : "Ocultar"}
          >
            {item.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        )}

        {item.type === "db" && item.dbId && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDeleteDbItem(item.dbId!)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

const SortablePortfolioList = ({
  items,
  onReorder,
  onToggleStaticVisibility,
  onDeleteDbItem,
}: SortablePortfolioListProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.key === active.id);
    const newIndex = items.findIndex((item) => item.key === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.key)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableRow
              key={item.key}
              item={item}
              onToggleStaticVisibility={onToggleStaticVisibility}
              onDeleteDbItem={onDeleteDbItem}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortablePortfolioList;