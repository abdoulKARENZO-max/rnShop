-- 1. Insert Categories (Use double quotes for camelCase columns)
INSERT INTO public.category (name, "imageUrl", slug)
VALUES 
('Smartphones', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 'smartphones'),
('Laptops', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 'laptops'),
('Audio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'audio');

-- 2. Insert Products
-- Note: Your types show "imagesUrl" (with an 's') and "heroImage"
INSERT INTO public.product (title, slug, "imageUrl", price, "heroImage", category, "maxQuantity")
VALUES 
('iPhone 15 Pro', 'iphone-15-pro', ARRAY['https://images.unsplash.com/photo-1696446701796-da61225697cc'], 999, 'https://images.unsplash.com/photo-1696446701796-da61225697cc', 1, 10),
('MacBook Air M2', 'macbook-air-m2', ARRAY['https://images.unsplash.com/photo-1611186871348-b1ec696e5237'], 1199, 'https://images.unsplash.com/photo-1611186871348-b1ec696e5237', 2, 5),
('Sony WH-1000XM5', 'sony-wh-1000xm5', ARRAY['https://images.unsplash.com/photo-1546435770-a3e426bf472b'], 349, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b', 3, 15);