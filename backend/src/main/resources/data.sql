INSERT INTO categories (name, slug, icon) VALUES
  ('Electronics', 'electronics', 'cpu'),
  ('Fashion', 'fashion', 'shirt'),
  ('Home & Kitchen', 'home-kitchen', 'sofa'),
  ('Books', 'books', 'book'),
  ('Beauty & Personal Care', 'beauty', 'sparkles'),
  ('Sports & Fitness', 'sports', 'dumbbell')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (name, description, brand, price, mrp, stock, image_url, rating, rating_count, category_id, created_at, active) VALUES
  ('Wireless Noise-Cancelling Headphones', 'Over-ear Bluetooth headphones with 30-hour battery life and active noise cancellation.', 'SoundWave', 4999.00, 7999.00, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 4.3, 812, 1, NOW(), true),
  ('Smartphone 5G 128GB', '6.5-inch AMOLED display, 5000mAh battery, triple camera setup.', 'Nexora', 18999.00, 24999.00, 30, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 4.5, 2301, 1, NOW(), true),
  ('Smart Watch Series X', 'Fitness tracking, heart-rate monitor, 7-day battery, AMOLED display.', 'PulseFit', 3499.00, 5999.00, 60, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 4.1, 540, 1, NOW(), true),
  ('Men Slim Fit Casual Shirt', 'Breathable cotton-blend shirt, machine washable, regular fit.', 'UrbanThread', 799.00, 1499.00, 120, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 4.0, 315, 2, NOW(), true),
  ('Women Ethnic Kurta Set', 'Printed rayon kurta with palazzo, festive wear.', 'Rangeela', 1199.00, 2199.00, 80, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500', 4.4, 210, 2, NOW(), true),
  ('Running Shoes Air Cushion', 'Lightweight breathable mesh running shoes with cushioned sole.', 'Stride', 2199.00, 3499.00, 90, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 4.2, 980, 2, NOW(), true),
  ('Non-Stick Cookware Set (5pc)', 'Induction-friendly non-stick cookware set with tempered glass lids.', 'HomeChef', 2499.00, 3999.00, 40, 'https://images.unsplash.com/photo-1584990347449-a2d4c2c33b95?w=500', 4.3, 156, 3, NOW(), true),
  ('Memory Foam Pillow (Set of 2)', 'Orthopedic cervical support pillow with breathable cover.', 'CloudNine', 999.00, 1799.00, 100, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', 4.1, 402, 3, NOW(), true),
  ('LED Desk Lamp', 'Touch-control 3-mode LED lamp with USB charging port.', 'Brighto', 699.00, 1199.00, 70, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 4.0, 88, 3, NOW(), true),
  ('Atomic Habits', 'An easy and proven way to build good habits and break bad ones.', 'Penguin', 399.00, 599.00, 200, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 4.8, 5600, 4, NOW(), true),
  ('The Alchemist', 'A fable about following your dreams, by Paulo Coelho.', 'HarperCollins', 299.00, 450.00, 150, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', 4.6, 4300, 4, NOW(), true),
  ('Vitamin C Face Serum', 'Brightening serum with hyaluronic acid, 30ml.', 'GlowLab', 549.00, 899.00, 130, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', 4.2, 670, 5, NOW(), true),
  ('Matte Lipstick Combo (3pc)', 'Long-lasting waterproof matte lipstick set.', 'ColorPop', 449.00, 799.00, 110, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500', 4.0, 240, 5, NOW(), true),
  ('Adjustable Dumbbell Set 20kg', 'Pair of adjustable dumbbells for home strength training.', 'IronCore', 3299.00, 4999.00, 25, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 4.4, 190, 6, NOW(), true),
  ('Yoga Mat Anti-Slip', '6mm extra-thick eco-friendly yoga mat with carry strap.', 'ZenFit', 599.00, 999.00, 200, 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500', 4.3, 860, 6, NOW(), true),
  ('4K Ultra HD Smart TV 43-inch', 'Smart TV with built-in streaming apps and voice remote.', 'VisionMax', 22999.00, 32999.00, 20, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500', 4.5, 1120, 1, NOW(), true)
ON DUPLICATE KEY UPDATE name = VALUES(name);
