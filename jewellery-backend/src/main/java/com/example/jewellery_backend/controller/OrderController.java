
package com.example.jewellery_backend.controller;

import com.example.jewellery_backend.entity.Order;
import com.example.jewellery_backend.repository.OrderRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;

    private static final Set<String> VALID_STATUSES = Set.of(
        "PENDING",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
    );

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Customer: Track order status


@PostMapping("/{id}/track")
public Map<String, Object> trackOrder(
        @PathVariable Long id,
        @RequestBody Map<String, String> request) {

    String phone = request.get("phone");

    if (phone == null || phone.isBlank()) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Phone number is required"
        );
    }

    Order order = orderRepository.findById(id)
        .filter(o -> o.getPhone() != null
            && o.getPhone().equals(phone.trim()))
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Order not found or details do not match"
        ));

    Map<String, Object> result = new HashMap<>();
    result.put("orderId", order.getId());
    result.put("status", order.getStatus());

    return result;
}
    // Customer: Create order
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        return orderRepository.save(order);
    }

    // Customer: View order history by phone number
    @PostMapping("/my-orders")
    public List<Order> getMyOrders(
            @RequestBody Map<String, String> request) {

        String phone = request.get("phone");

        if (phone == null || phone.isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Phone number is required"
            );
        }

        return orderRepository.findByPhoneOrderByIdDesc(phone.trim());
    }

    // Admin: View all orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Admin: Update order status
    @PatchMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Order not found"
            ));

        String newStatus = status.trim().toUpperCase();

        if (!VALID_STATUSES.contains(newStatus)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid order status"
            );
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}