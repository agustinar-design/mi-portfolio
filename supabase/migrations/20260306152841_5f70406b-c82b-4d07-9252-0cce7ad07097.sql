-- Fix category check constraint to match new categories
ALTER TABLE public.portfolio_items DROP CONSTRAINT portfolio_items_category_check;
ALTER TABLE public.portfolio_items ADD CONSTRAINT portfolio_items_category_check CHECK (category = ANY (ARRAY['images'::text, 'video'::text]));

-- Fix RLS policies on hidden_static_items: drop restrictive, recreate as permissive
DROP POLICY "Anyone can view hidden items" ON public.hidden_static_items;
DROP POLICY "Auth users can hide items" ON public.hidden_static_items;
DROP POLICY "Auth users can unhide items" ON public.hidden_static_items;

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
