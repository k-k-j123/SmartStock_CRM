package com.kaushik.SmartStock.Repository;

import com.kaushik.SmartStock.Documents.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
    Optional<Customer> findByPhone(String phone);
    List<Customer> findByNameContainingIgnoreCaseOrPhoneContaining(String name, String phone);
}
