package com.ecommerce.service.impl;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartResponse getCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        return toResponse(cart);
    }

    @Override
    public CartResponse addItem(String userEmail, CartItemRequest request) {
        Cart cart = getOrCreateCart(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Only " + product.getStock() + " units of \"" + product.getName() + "\" left in stock");
        }

        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            int newQty = existing.getQuantity() + request.getQuantity();
            if (product.getStock() < newQty) {
                throw new BadRequestException("Only " + product.getStock() + " units of \"" + product.getName() + "\" left in stock");
            }
            existing.setQuantity(newQty);
        } else {
            cart.getItems().add(CartItem.builder()
                    .id(UUID.randomUUID().toString())
                    .productId(product.getId())
                    .quantity(request.getQuantity())
                    .build());
        }

        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public CartResponse updateItem(String userEmail, String cartItemId, Integer quantity) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            if (product.getStock() < quantity) {
                throw new BadRequestException("Only " + product.getStock() + " units left in stock");
            }
            item.setQuantity(quantity);
        }

        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public CartResponse removeItem(String userEmail, String cartItemId) {
        Cart cart = getOrCreateCart(userEmail);
        boolean removed = cart.getItems().removeIf(i -> i.getId().equals(cartItemId));
        if (!removed) {
            throw new ResourceNotFoundException("Cart item not found");
        }
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public void clearCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().userId(user.getId()).items(new ArrayList<>()).build()));
    }

    private CartResponse toResponse(Cart cart) {
        if (cart.getItems().isEmpty()) {
            return CartResponse.builder()
                    .cartId(cart.getId())
                    .items(List.of())
                    .subtotal(BigDecimal.ZERO)
                    .totalItems(0)
                    .build();
        }

        List<String> productIds = cart.getItems().stream().map(CartItem::getProductId).toList();
        Map<String, Product> productsById = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        List<CartResponse.CartItemResponse> items = cart.getItems().stream()
                .filter(i -> productsById.containsKey(i.getProductId()))
                .map(i -> {
                    Product product = productsById.get(i.getProductId());
                    return CartResponse.CartItemResponse.builder()
                            .cartItemId(i.getId())
                            .productId(product.getId())
                            .productName(product.getName())
                            .imageUrl(product.getImageUrl())
                            .price(product.getPrice())
                            .quantity(i.getQuantity())
                            .availableStock(product.getStock())
                            .lineTotal(product.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                            .build();
                })
                .toList();

        BigDecimal subtotal = items.stream()
                .map(CartResponse.CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream().mapToInt(CartResponse.CartItemResponse::getQuantity).sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .subtotal(subtotal)
                .totalItems(totalItems)
                .build();
    }
}
