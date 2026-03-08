
CREATE TABLE public.before_after_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  brand_name text NOT NULL,
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.before_after_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Before after items are viewable by everyone"
ON public.before_after_items FOR SELECT
USING (true);

CREATE POLICY "Auth users can insert before after items"
ON public.before_after_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth users can delete before after items"
ON public.before_after_items FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Auth users can update before after items"
ON public.before_after_items FOR UPDATE
TO authenticated
USING (true);
