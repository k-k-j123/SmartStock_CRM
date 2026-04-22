package com.kaushik.SmartStock.Repository;

import com.kaushik.SmartStock.Documents.Sales;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesRepository extends MongoRepository<Sales, String> {
    List<Sales> findByCustomerIdOrderByCreatedAtDesc(String customerId);
}
