insert into public.marketplace_products (slug, name, category, base_price, thumbnail_url, is_active, canvas_config)
values
  ('brad-v1-custom', 'Brad V1 Custom', 'Kemeja Custom', 185000, '/assets/katalog/Model Kemeja/Brad-v1/(brad v-1)hitam.png', true, '{"color":"#111827","label":"Brad V1"}'::jsonb),
  ('brad-v2-custom', 'Brad V2 Custom', 'Kemeja Custom', 215000, '/assets/katalog/Model Kemeja/Brad-v2/(brad v-2)warna navi.png', true, '{"color":"#1e3a8a","label":"Brad V2"}'::jsonb),
  ('brad-v3-custom', 'Brad V3 Custom', 'Kemeja Custom', 235000, '/assets/katalog/Model Kemeja/Brad-V3/(brad v-3)hitam.png', true, '{"color":"#0f172a","label":"Brad V3"}'::jsonb),
  ('jaket-custom', 'Jaket Custom', 'Outerwear', 285000, '/assets/katalog/jaket/jaket-depan-hitam.jpeg', true, '{"color":"#18181b","label":"Jaket"}'::jsonb)
on conflict (slug) do update
set
  name = excluded.name,
  category = excluded.category,
  base_price = excluded.base_price,
  thumbnail_url = excluded.thumbnail_url,
  is_active = excluded.is_active,
  canvas_config = excluded.canvas_config,
  updated_at = now();
