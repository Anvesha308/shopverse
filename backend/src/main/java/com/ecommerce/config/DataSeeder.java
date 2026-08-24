package com.ecommerce.config;

import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Seeds starter categories and products on first run (only if collections are empty).
 * Replaces the old MySQL data.sql approach - MongoDB has no init-script mechanism,
 * so seeding happens here in code, which also works identically in production.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return; // already seeded
        }

        Map<String, Category> categories = new HashMap<>();
        List<Category> savedCategories = categoryRepository.saveAll(List.of(
                Category.builder().name("Electronics").slug("electronics").icon("cpu").build(),
                Category.builder().name("Fashion").slug("fashion").icon("shirt").build(),
                Category.builder().name("Home & Kitchen").slug("home-kitchen").icon("sofa").build(),
                Category.builder().name("Books").slug("books").icon("book").build(),
                Category.builder().name("Beauty & Personal Care").slug("beauty").icon("sparkles").build(),
                Category.builder().name("Sports & Fitness").slug("sports").icon("dumbbell").build()
        ));
        for (Category c : savedCategories) {
            categories.put(c.getName(), c);
        }

        productRepository.saveAll(List.of(
                product("Wireless Noise-Cancelling Headphones", "Over-ear Bluetooth headphones with 30-hour battery life and active noise cancellation.", "SoundWave", 4999, 7999, 45, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", 4.3, 812, categories.get("Electronics")),
                product("Smartphone 5G 128GB", "6.5-inch AMOLED display, 5000mAh battery, triple camera setup.", "Nexora", 18999, 24999, 30, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", 4.5, 2301, categories.get("Electronics")),
                product("Smart Watch Series X", "Fitness tracking, heart-rate monitor, 7-day battery, AMOLED display.", "PulseFit", 3499, 5999, 60, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", 4.1, 540, categories.get("Electronics")),
                product("Men Slim Fit Casual Shirt", "Breathable cotton-blend shirt, machine washable, regular fit.", "UrbanThread", 799, 1499, 120, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500", 4.0, 315, categories.get("Fashion")),
                product("Women Ethnic Kurta Set", "Printed rayon kurta with palazzo, festive wear.", "Rangeela", 1199, 2199, 80, "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500", 4.4, 210, categories.get("Fashion")),
                product("Running Shoes Air Cushion", "Lightweight breathable mesh running shoes with cushioned sole.", "Stride", 2199, 3499, 90, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", 4.2, 980, categories.get("Fashion")),
                product("Non-Stick Cookware Set (5pc)", "Induction-friendly non-stick cookware set with tempered glass lids.", "HomeChef", 2499, 3999, 40, "https://images.unsplash.com/photo-1584990347449-a2d4c2c33b95?w=500", 4.3, 156, categories.get("Home & Kitchen")),
                product("Memory Foam Pillow (Set of 2)", "Orthopedic cervical support pillow with breathable cover.", "CloudNine", 999, 1799, 100, "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500", 4.1, 402, categories.get("Home & Kitchen")),
                product("LED Desk Lamp", "Touch-control 3-mode LED lamp with USB charging port.", "Brighto", 699, 1199, 70, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500", 4.0, 88, categories.get("Home & Kitchen")),
                product("Atomic Habits", "An easy and proven way to build good habits and break bad ones.", "Penguin", 399, 599, 200, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500", 4.8, 5600, categories.get("Books")),
                product("The Alchemist", "A fable about following your dreams, by Paulo Coelho.", "HarperCollins", 299, 450, 150, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500", 4.6, 4300, categories.get("Books")),
                product("Vitamin C Face Serum", "Brightening serum with hyaluronic acid, 30ml.", "GlowLab", 549, 899, 130, "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500", 4.2, 670, categories.get("Beauty & Personal Care")),
                product("Matte Lipstick Combo (3pc)", "Long-lasting waterproof matte lipstick set.", "ColorPop", 449, 799, 110, "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500", 4.0, 240, categories.get("Beauty & Personal Care")),
                product("Adjustable Dumbbell Set 20kg", "Pair of adjustable dumbbells for home strength training.", "IronCore", 3299, 4999, 25, "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500", 4.4, 190, categories.get("Sports & Fitness")),
                product("Yoga Mat Anti-Slip", "6mm extra-thick eco-friendly yoga mat with carry strap.", "ZenFit", 599, 999, 200, "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500", 4.3, 860, categories.get("Sports & Fitness")),
                product("4K Ultra HD Smart TV 43-inch", "Smart TV with built-in streaming apps and voice remote.", "VisionMax", 22999, 32999, 20, "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500", 4.5, 1120, categories.get("Electronics"))
        ));
    }

    private Product product(String name, String description, String brand, double price, double mrp,
                             int stock, String imageUrl, double rating, int ratingCount, Category category) {
        return Product.builder()
                .name(name)
                .description(description)
                .brand(brand)
                .price(BigDecimal.valueOf(price))
                .mrp(BigDecimal.valueOf(mrp))
                .stock(stock)
                .imageUrl(imageUrl)
                .rating(rating)
                .ratingCount(ratingCount)
                .categoryId(category.getId())
                .categoryName(category.getName())
                .build();
    }
}
