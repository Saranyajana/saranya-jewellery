
package com.example.jewellery_backend.repository;

import com.example.jewellery_backend.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductReviewRepository
        extends JpaRepository<ProductReview, Long> {

    List<ProductReview> findByProductNameIgnoreCaseOrderByCreatedAtDesc(
            String productName);
}
