
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "Admins insert portfolio items" ON public.portfolio_items;
DROP POLICY "Admins update portfolio items" ON public.portfolio_items;
DROP POLICY "Admins delete portfolio items" ON public.portfolio_items;
CREATE POLICY "Admins insert portfolio items" ON public.portfolio_items FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin') AND user_id = auth.uid());
CREATE POLICY "Admins update portfolio items" ON public.portfolio_items FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete portfolio items" ON public.portfolio_items FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins insert before after items" ON public.before_after_items;
DROP POLICY "Admins update before after items" ON public.before_after_items;
DROP POLICY "Admins delete before after items" ON public.before_after_items;
CREATE POLICY "Admins insert before after items" ON public.before_after_items FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin') AND user_id = auth.uid());
CREATE POLICY "Admins update before after items" ON public.before_after_items FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin') AND user_id = auth.uid()) WITH CHECK (private.has_role(auth.uid(), 'admin') AND user_id = auth.uid());
CREATE POLICY "Admins delete before after items" ON public.before_after_items FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin') AND user_id = auth.uid());

DROP POLICY "Admins insert before after images" ON public.before_after_images;
DROP POLICY "Admins update before after images" ON public.before_after_images;
DROP POLICY "Admins delete before after images" ON public.before_after_images;
CREATE POLICY "Admins insert before after images" ON public.before_after_images FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin') AND EXISTS (SELECT 1 FROM public.before_after_items i WHERE i.id = before_after_images.item_id AND i.user_id = auth.uid()));
CREATE POLICY "Admins update before after images" ON public.before_after_images FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin') AND EXISTS (SELECT 1 FROM public.before_after_items i WHERE i.id = before_after_images.item_id AND i.user_id = auth.uid())) WITH CHECK (private.has_role(auth.uid(), 'admin') AND EXISTS (SELECT 1 FROM public.before_after_items i WHERE i.id = before_after_images.item_id AND i.user_id = auth.uid()));
CREATE POLICY "Admins delete before after images" ON public.before_after_images FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin') AND EXISTS (SELECT 1 FROM public.before_after_items i WHERE i.id = before_after_images.item_id AND i.user_id = auth.uid()));

DROP POLICY "Admins hide items" ON public.hidden_static_items;
DROP POLICY "Admins unhide items" ON public.hidden_static_items;
CREATE POLICY "Admins hide items" ON public.hidden_static_items FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins unhide items" ON public.hidden_static_items FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins insert static_item_orders" ON public.static_item_orders;
DROP POLICY "Admins update static_item_orders" ON public.static_item_orders;
DROP POLICY "Admins delete static_item_orders" ON public.static_item_orders;
CREATE POLICY "Admins insert static_item_orders" ON public.static_item_orders FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update static_item_orders" ON public.static_item_orders FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete static_item_orders" ON public.static_item_orders FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Only admins can insert logos" ON public.logos;
DROP POLICY "Only admins can update logos" ON public.logos;
DROP POLICY "Only admins can delete logos" ON public.logos;
CREATE POLICY "Only admins can insert logos" ON public.logos FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin') AND auth.uid() = user_id);
CREATE POLICY "Only admins can update logos" ON public.logos FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete logos" ON public.logos FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can insert logo images" ON public.logo_images;
DROP POLICY "Admins can update logo images" ON public.logo_images;
DROP POLICY "Admins can delete logo images" ON public.logo_images;
CREATE POLICY "Admins can insert logo images" ON public.logo_images FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update logo images" ON public.logo_images FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete logo images" ON public.logo_images FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins insert papeleria items" ON public.papeleria_items;
DROP POLICY "Admins update papeleria items" ON public.papeleria_items;
DROP POLICY "Admins delete papeleria items" ON public.papeleria_items;
CREATE POLICY "Admins insert papeleria items" ON public.papeleria_items FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin') AND user_id = auth.uid());
CREATE POLICY "Admins update papeleria items" ON public.papeleria_items FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete papeleria items" ON public.papeleria_items FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can list portfolio files" ON storage.objects;
DROP POLICY "Admins can upload portfolio files" ON storage.objects;
DROP POLICY "Admins can delete portfolio files" ON storage.objects;
CREATE POLICY "Admins can list portfolio files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'portfolio' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload portfolio files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
