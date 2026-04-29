package Springboot_April.spring_april.service.gateway;

import Springboot_April.spring_april.dto.PaymentRequest;

public interface PaymentGateway {
    /**
     * Initiates a payment with the gateway.
     * For Bakong, this involves generating a KHQR string.
     */
    String initiatePayment(PaymentRequest request);

    /**
     * Verifies the status of a transaction.
     */
    boolean verifyPayment(String transactionId);
}
