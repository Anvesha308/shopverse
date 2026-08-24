package com.ecommerce.service;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(String userEmail);
    CartResponse addItem(String userEmail, CartItemRequest request);
    CartResponse updateItem(String userEmail, String cartItemId, Integer quantity);
    CartResponse removeItem(String userEmail, String cartItemId);
    void clearCart(String userEmail);
}
