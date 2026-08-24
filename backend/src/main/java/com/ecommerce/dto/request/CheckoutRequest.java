package com.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotBlank
    private String shippingAddress;
    @NotBlank
    private String shippingCity;
    @NotBlank
    private String shippingPincode;

    /** MOCK | CARD | UPI - simulated payment method */
    private String paymentMethod = "MOCK";
}
