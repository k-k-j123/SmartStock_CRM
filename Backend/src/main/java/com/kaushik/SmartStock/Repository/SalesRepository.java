package com.kaushik.SmartStock.Repository;

import com.kaushik.SmartStock.Documents.Sales;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesRepository extends MongoRepository<Sales, String> {
}

