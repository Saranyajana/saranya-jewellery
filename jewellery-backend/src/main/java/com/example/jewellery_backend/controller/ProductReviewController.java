
package com.example.jewellery_backend.controller;

import com.example.jewellery_backend.entity.ProductReview;
import com.example.jewellery_backend.repository.ProductReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "https://saranyajana.github.io")
public class ProductReviewController {

    private final ProductReviewRepository reviewRepository;

    public ProductReviewController(
            ProductReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @PostMapping
    public ProductReview createReview(
            @RequestBody ProductReview review) {

        if (review.getProductName() == null
                || review.getProductName().isBlank()
                || review.getCustomerName() == null
                || review.getCustomerName().isBlank()
                || review.getRating() == null
                || review.getRating() < 1
                || review.getRating() > 5) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Product name, customer name and a rating from 1 to 5 are required");
        }

        if (review.getProductName().length() > 100
                || review.getCustomerName().length() > 100
                || (review.getReviewText() != null
                && review.getReviewText().length() > 1000)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Review details exceed the allowed length");
        }

        ProductReview newReview = new ProductReview();
        newReview.setProductName(review.getProductName().trim());
        newReview.setCustomerName(review.getCustomerName().trim());
        newReview.setRating(review.getRating());
        newReview.setReviewText(
                review.getReviewText() == null
                        ? null : review.getReviewText().trim());

        return reviewRepository.save(newReview);
    }

    @GetMapping("/{productName}")
    public List<ProductReview> getReviews(
            @PathVariable String productName) {
        return reviewRepository
                .findByProductNameIgnoreCaseOrderByCreatedAtDesc(
                        productName);
    }
}
