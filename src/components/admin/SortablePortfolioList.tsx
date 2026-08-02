import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { memo, useCallback } from "react";

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

const SortableRow = memo(({ item, onToggleStaticVisibility, onDeleteDbItem }: SortableRowProps) => {
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
        transform: CSS.Translate.toString(transform),
        transition,
        willChange: "transform",
        position: "relative",
        zIndex: isDragging ? 50 : undefined,
      }}
      className={`flex items-center gap-3 rounded-2xl border p-3 ${
        isDragging
          ? "border-primary/40 bg-card shadow-2xl"
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
          <video src={item.video} className="h-full w-full object-cover" preload="none" muted />
        ) : (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
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
});
SortableRow.displayName = "SortableRow";

const SortablePortfolioList = ({
  items,
  onReorder,
  onToggleStaticVisibility,
  onDeleteDbItem,
}: SortablePortfolioListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.key === active.id);
    const newIndex = items.findIndex((item) => item.key === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(items, oldIndex, newIndex));
  }, [items, onReorder]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
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