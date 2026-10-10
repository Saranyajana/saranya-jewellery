package com.example.jewellery_backend.repository;

import com.example.jewellery_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Customer: Find all orders by phone number
    List<Order> findByPhoneOrderByIdDesc(String phone);
}
