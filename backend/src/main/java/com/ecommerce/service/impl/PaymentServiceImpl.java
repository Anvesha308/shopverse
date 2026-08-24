package com.ecommerce.service.impl;

import com.ecommerce.dto.request.PaymentVerifyRequest;
import com.ecommerce.dto.response.PaymentResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.PaymentRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Simulated payment gateway integration (Razorpay/Stripe style flow) for demo purposes.
 * In production, replace verifyPayment's internals with a real signature/webhook
 * verification call to the payment provider's API.
 */
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public PaymentResponse verifyPayment(String userEmail, PaymentVerifyRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("This order does not belong to you");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("This order has already been processed");
        }

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found"));

        String txnId = request.getTransactionId() != null
                ? request.getTransactionId()
                : "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        payment.setTransactionId(txnId);

        if (request.isSimulateSuccess()) {
            payment.setStatus(PaymentStatus.SUCCESS);
            order.setStatus(OrderStatus.PAID);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.CANCELLED);
            // restock items since payment failed
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        paymentRepository.save(payment);

        return PaymentResponse.builder()
                .transactionId(payment.getTransactionId())
                .status(payment.getStatus().name())
                .amount(payment.getAmount())
                .orderId(order.getId())
                .orderStatus(order.getStatus().name())
                .build();
    }
}
