
-- Create storage bucket for portfolio media
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Storage policies: public read, authenticated upload/delete
CREATE POLICY "Portfolio files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can upload portfolio files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete portfolio files"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Create portfolio_items table
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('basic', 'elaborate', 'video')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Portfolio items are viewable by everyone"
ON public.portfolio_items FOR SELECT USING (true);

-- Authenticated CRUD
CREATE POLICY "Auth users can insert portfolio items"
ON public.portfolio_items FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update portfolio items"
ON public.portfolio_items FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete portfolio items"
ON public.portfolio_items FOR DELETE
USING (auth.role() = 'authenticated');
