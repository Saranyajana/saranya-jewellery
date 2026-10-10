
package com.example.jewellery_backend.controller;

import com.example.jewellery_backend.entity.Enquiry;
import com.example.jewellery_backend.repository.EnquiryRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "https://saranyajana.github.io")
public class EnquiryController {

    private final EnquiryRepository enquiryRepository;

    public EnquiryController(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    // Customer submits an enquiry
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Enquiry createEnquiry(@RequestBody Enquiry enquiry) {

        if (enquiry.getName() == null
                || enquiry.getName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Name is required");
        }

        if (enquiry.getPhone() == null
                || enquiry.getPhone().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Phone is required");
        }

        if (enquiry.getMessage() == null
                || enquiry.getMessage().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Message is required");
        }

        enquiry.setName(enquiry.getName().trim());
        enquiry.setPhone(enquiry.getPhone().trim());
        enquiry.setMessage(enquiry.getMessage().trim());

        if (enquiry.getEmail() != null) {
            enquiry.setEmail(enquiry.getEmail().trim());
        }

        return enquiryRepository.save(enquiry);
    }

    // Admin enquiry list - protect this endpoint before production use
    @GetMapping
    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll();
    }
}
