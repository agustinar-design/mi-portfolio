
CREATE TABLE public.logo_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_id UUID NOT NULL REFERENCES public.logos(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.logo_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.logo_images TO authenticated;
GRANT ALL ON public.logo_images TO service_role;

ALTER TABLE public.logo_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view logo images"
  ON public.logo_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert logo images"
  ON public.logo_images FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update logo images"
  ON public.logo_images FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete logo images"
  ON public.logo_images FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_logo_images_logo_id ON public.logo_images(logo_id, display_order);

-- Backfill: mover image_url existente de logos como primer mockup
INSERT INTO public.logo_images (logo_id, image_url, display_order)
SELECT id, image_url, 0 FROM public.logos WHERE image_url IS NOT NULL AND image_url <> '';
