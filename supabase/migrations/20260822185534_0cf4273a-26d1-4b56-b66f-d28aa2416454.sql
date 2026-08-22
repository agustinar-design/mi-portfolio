CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.papeleria_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  piece_type text NOT NULL DEFAULT 'otros',
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.papeleria_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.papeleria_items TO authenticated;
GRANT ALL ON public.papeleria_items TO service_role;

ALTER TABLE public.papeleria_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Papeleria items are viewable by everyone"
  ON public.papeleria_items FOR SELECT USING (true);

CREATE POLICY "Admins insert papeleria items"
  ON public.papeleria_items FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

CREATE POLICY "Admins update papeleria items"
  ON public.papeleria_items FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete papeleria items"
  ON public.papeleria_items FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_papeleria_items_updated_at
  BEFORE UPDATE ON public.papeleria_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();