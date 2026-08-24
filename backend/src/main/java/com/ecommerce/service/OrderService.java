package com.ecommerce.service;

import com.ecommerce.dto.request.CheckoutRequest;
import com.ecommerce.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse checkout(String userEmail, CheckoutRequest request);
    Page<OrderResponse> getMyOrders(String userEmail, Pageable pageable);
    OrderResponse getOrder(String userEmail, String orderId);
}
