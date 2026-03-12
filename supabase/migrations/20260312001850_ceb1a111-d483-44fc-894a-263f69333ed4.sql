
CREATE TABLE public.static_item_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_key text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.static_item_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read static_item_orders"
  ON public.static_item_orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage static_item_orders"
  ON public.static_item_orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
