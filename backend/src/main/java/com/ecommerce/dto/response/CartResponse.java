package com.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private String cartId;
    private List<CartItemResponse> items;
    private BigDecimal subtotal;
    private Integer totalItems;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private String cartItemId;
        private String productId;
        private String productName;
        private String imageUrl;
        private BigDecimal price;
        private Integer quantity;
        private Integer availableStock;
        private BigDecimal lineTotal;
    }
}
