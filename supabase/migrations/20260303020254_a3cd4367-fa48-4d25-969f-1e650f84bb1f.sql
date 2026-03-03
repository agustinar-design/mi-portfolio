
CREATE TABLE public.hidden_static_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_key text NOT NULL UNIQUE,
  hidden_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hidden_static_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hidden items"
  ON public.hidden_static_items FOR SELECT
  USING (true);

CREATE POLICY "Auth users can hide items"
  ON public.hidden_static_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can unhide items"
  ON public.hidden_static_items FOR DELETE
  TO authenticated
  USING (true);
