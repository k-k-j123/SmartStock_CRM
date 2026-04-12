package com.kaushik.SmartStock.Repository;

import com.kaushik.SmartStock.Documents.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByStockQuantityLessThan(int threshold);
    List<Product> findByNameContainingIgnoreCase(String name);
}