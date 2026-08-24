package com.ecommerce.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    private String id;

    @Indexed(unique = true)
    private String orderId;

    private String transactionId;
    private String provider;
    private String method;
    private BigDecimal amount;

    @Builder.Default
    private PaymentStatus status = PaymentStatus.INITIATED;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
