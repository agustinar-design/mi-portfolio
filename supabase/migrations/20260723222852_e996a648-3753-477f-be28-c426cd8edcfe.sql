
CREATE TABLE public.logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.logos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.logos TO authenticated;
GRANT ALL ON public.logos TO service_role;

ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logos are viewable by everyone"
  ON public.logos FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert logos"
  ON public.logos FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = user_id);

CREATE POLICY "Only admins can update logos"
  ON public.logos FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete logos"
  ON public.logos FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
