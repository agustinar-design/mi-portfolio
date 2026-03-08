
-- Create child table for multiple before/after images
CREATE TABLE public.before_after_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.before_after_items(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('before', 'after')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.before_after_images ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Before after images viewable by everyone"
  ON public.before_after_images FOR SELECT
  USING (true);

CREATE POLICY "Auth users can insert before after images"
  ON public.before_after_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can delete before after images"
  ON public.before_after_images FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Auth users can update before after images"
  ON public.before_after_images FOR UPDATE
  TO authenticated
  USING (true);

-- Migrate existing data from before_after_items into new table
INSERT INTO public.before_after_images (item_id, image_url, image_type, display_order)
SELECT id, before_image_url, 'before', 0 FROM public.before_after_items
WHERE before_image_url IS NOT NULL AND before_image_url != '';

INSERT INTO public.before_after_images (item_id, image_url, image_type, display_order)
SELECT id, after_image_url, 'after', 0 FROM public.before_after_items
WHERE after_image_url IS NOT NULL AND after_image_url != '';

-- Make old columns nullable (keep for backward compat, code will use new table)
ALTER TABLE public.before_after_items ALTER COLUMN before_image_url SET DEFAULT '';
ALTER TABLE public.before_after_items ALTER COLUMN after_image_url SET DEFAULT '';
