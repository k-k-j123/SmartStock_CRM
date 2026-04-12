package com.kaushik.SmartStock.Controller;

import com.kaushik.SmartStock.Documents.Customer;
import com.kaushik.SmartStock.Documents.Product;
import com.kaushik.SmartStock.Service.CustomerService;
import com.kaushik.SmartStock.Service.ProductService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final ProductService productService;
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<SearchResult> search(@RequestParam String query) {
        List<Product> products = productService.searchProducts(query);
        List<Customer> customers = customerService.searchCustomers(query);
        
        SearchResult result = SearchResult.builder()
                .products(products)
                .customers(customers)
                .build();
                
        return ResponseEntity.ok(result);
    }

    @Data
    @Builder
    public static class SearchResult {
        private List<Product> products;
        private List<Customer> customers;
    }
}
