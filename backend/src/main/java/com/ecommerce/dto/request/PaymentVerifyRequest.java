package com.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentVerifyRequest {
    @NotNull
    private Long orderId;
    private String transactionId;
    /** simulate success/failure for demo purposes */
    private boolean simulateSuccess = true;
}
