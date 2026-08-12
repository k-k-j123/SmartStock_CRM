package com.kaushik.SmartStock.Controller;

import com.kaushik.SmartStock.Documents.Customer;
import com.kaushik.SmartStock.Service.CustomerService;
import com.kaushik.SmartStock.Service.EmailService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private static final Pattern NAME_PATTERN = Pattern.compile("^[A-Za-z][A-Za-z\\s'-]*[A-Za-z]$|^[A-Za-z]$");

    private final CustomerService customerService;

    private final EmailService emailService;

    @PostMapping()
    public ResponseEntity<String> createCustomer(
            @RequestBody com.kaushik.SmartStock.DTO.CustomerRequest customerRequest) {
        ResponseEntity<String> validationError = validateCustomerName(customerRequest.getName());
        if (validationError != null) {
            return validationError;
        }
        Customer customer = new Customer();
        customer.setName(customerRequest.getName());
        customer.setPhone(customerRequest.getPhone());
        customer.setEmail(customerRequest.getEmail());
        customerService.createCustomer(customer);
        return ResponseEntity.ok("customer created successfully");
    }

    @GetMapping()
    public ResponseEntity<List<Customer>> getCustomers() {
        return ResponseEntity.ok(customerService.getCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable String id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<Customer> getCustomerByPhone(@PathVariable String phone) {
        return customerService.getCustByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCustomer(@PathVariable String id,
            @RequestBody com.kaushik.SmartStock.DTO.CustomerRequest customerRequest) {
        ResponseEntity<String> validationError = validateCustomerName(customerRequest.getName());
        if (validationError != null) {
            return validationError;
        }
        Customer customer = new Customer();
        customer.setId(id);
        customer.setName(customerRequest.getName());
        customer.setPhone(customerRequest.getPhone());
        customer.setEmail(customerRequest.getEmail());
        customerService.createCustomer(customer);
        return ResponseEntity.ok("customer updated successfully");
    }

    private ResponseEntity<String> validateCustomerName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required.");
        }

        String trimmed = name.trim();
        if (!NAME_PATTERN.matcher(trimmed).matches()) {
            return ResponseEntity.badRequest()
                    .body("Name can only contain letters, spaces, apostrophes, and hyphens.");
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("customer deleted successfully");
    }

    @PostMapping("/{id}/sendMail")
    public ResponseEntity<String> sendEmail(@PathVariable String id) {

        Optional<Customer> optionalCustomer = customerService.getCustomerById(id);

        if (optionalCustomer.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Customer not found");
        }

        Customer customer = optionalCustomer.get();

        emailService.sendEmails(
                customer.getEmail(),
                customer.getName());

        return ResponseEntity.ok("Mail sent successfully");
    }
}
