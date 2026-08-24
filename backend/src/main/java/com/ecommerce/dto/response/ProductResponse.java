package com.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private String brand;
    private BigDecimal price;
    private BigDecimal mrp;
    private Integer discountPercent;
    private Integer stock;
    private String imageUrl;
    private Double rating;
    private Integer ratingCount;
    private String categoryName;
    private String categoryId;
}
