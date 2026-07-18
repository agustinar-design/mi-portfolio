
-- 1. Roles infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Seed existing user(s) as admin so the site owner keeps access
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
ON CONFLICT DO NOTHING;

-- 2. portfolio_items — admin-only writes, must own row
DROP POLICY IF EXISTS "Auth users can delete portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Auth users can insert portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Auth users can update portfolio items" ON public.portfolio_items;

CREATE POLICY "Admins insert portfolio items" ON public.portfolio_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND user_id = auth.uid());
CREATE POLICY "Admins update portfolio items" ON public.portfolio_items
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete portfolio items" ON public.portfolio_items
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. before_after_items — admin-only writes scoped to own user_id
DROP POLICY IF EXISTS "Auth users can delete before after items" ON public.before_after_items;
DROP POLICY IF EXISTS "Auth users can insert before after items" ON public.before_after_items;
DROP POLICY IF EXISTS "Auth users can update before after items" ON public.before_after_items;

CREATE POLICY "Admins insert before after items" ON public.before_after_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND user_id = auth.uid());
CREATE POLICY "Admins update before after items" ON public.before_after_items
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND user_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND user_id = auth.uid());
CREATE POLICY "Admins delete before after items" ON public.before_after_items
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND user_id = auth.uid());

-- 4. before_after_images — admin-only, verified via parent item ownership
DROP POLICY IF EXISTS "Auth users can delete before after images" ON public.before_after_images;
DROP POLICY IF EXISTS "Auth users can insert before after images" ON public.before_after_images;
DROP POLICY IF EXISTS "Auth users can update before after images" ON public.before_after_images;

CREATE POLICY "Admins insert before after images" ON public.before_after_images
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    AND EXISTS (SELECT 1 FROM public.before_after_items i WHERE i.id = item_id AND i.user_id = auth.uid())
  );
CREATE POLICY "Admins update before after images" ON public.before_after_images
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND EXISTS (SELECT 1 FROM public.before_after_items i WHERE i.id = item_id AND i.user_id = auth.uid())
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    AND EXISTS (SELECT 1 FROM public.before_after_items i WHERE i.id = item_id AND i.user_id = auth.uid())
  );
CREATE POLICY "Admins delete before after images" ON public.before_after_images
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND EXISTS (SELECT 1 FROM public.before_after_items i WHERE i.id = item_id AND i.user_id = auth.uid())
  );

-- 5. hidden_static_items — admin-only writes
DROP POLICY IF EXISTS "Auth users can hide items" ON public.hidden_static_items;
DROP POLICY IF EXISTS "Auth users can unhide items" ON public.hidden_static_items;

CREATE POLICY "Admins hide items" ON public.hidden_static_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins unhide items" ON public.hidden_static_items
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. static_item_orders — admin-only writes (keep public read)
DROP POLICY IF EXISTS "Authenticated users can manage static_item_orders" ON public.static_item_orders;

CREATE POLICY "Admins insert static_item_orders" ON public.static_item_orders
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update static_item_orders" ON public.static_item_orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete static_item_orders" ON public.static_item_orders
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. Storage: prevent public listing; keep public URL access (public bucket serves objects directly)
DROP POLICY IF EXISTS "Portfolio files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio files" ON storage.objects;

CREATE POLICY "Admins can list portfolio files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload portfolio files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
