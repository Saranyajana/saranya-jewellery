package com.example.jewellery_backend.repository;

import com.example.jewellery_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
