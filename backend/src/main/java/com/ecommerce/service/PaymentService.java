package com.ecommerce.service;

import com.ecommerce.dto.request.PaymentVerifyRequest;
import com.ecommerce.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse verifyPayment(String userEmail, PaymentVerifyRequest request);
}
