package com.example.jewellery_backend.repository;

import com.example.jewellery_backend.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryRepository
        extends JpaRepository<Enquiry, Long> {
}
