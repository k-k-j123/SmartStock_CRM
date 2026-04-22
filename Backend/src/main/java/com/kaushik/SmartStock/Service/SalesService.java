package com.kaushik.SmartStock.Service;

import com.kaushik.SmartStock.Documents.Customer;
import com.kaushik.SmartStock.Documents.Product;
import com.kaushik.SmartStock.Documents.Sales;
import com.kaushik.SmartStock.Documents.SalesItem;
import com.kaushik.SmartStock.Repository.CustomerRepository;
import com.kaushik.SmartStock.Repository.ProductRepository;
import com.kaushik.SmartStock.Repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final SalesRepository salesRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public Sales createSale(com.kaushik.SmartStock.DTO.SaleRequest saleRequest) {
        Customer customer = null;

        if (saleRequest.getCustomerId() != null && !saleRequest.getCustomerId().isEmpty()) {
            customer = customerRepository.findById(saleRequest.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found: " + saleRequest.getCustomerId()));
        } else if (saleRequest.getCustomerPhone() != null && !saleRequest.getCustomerPhone().isEmpty()) {
            customer = customerRepository.findByPhone(saleRequest.getCustomerPhone())
                    .orElseGet(() -> {
                        Customer newCustomer = new Customer();
                        newCustomer.setPhone(saleRequest.getCustomerPhone());
                        newCustomer.setName(
                                saleRequest.getCustomerName() != null ? saleRequest.getCustomerName() : "Unknown");
                        return customerRepository.save(newCustomer);
                    });
        } else {
            throw new RuntimeException("Customer ID or Phone must be provided");
        }

        List<SalesItem> salesItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (com.kaushik.SmartStock.DTO.SaleItemRequest itemReq : saleRequest.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Decrement stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            // Create SalesItem snapshot
            SalesItem salesItem = new SalesItem();
            salesItem.setProductId(product.getId());
            salesItem.setName(product.getName());
            salesItem.setQuantity(itemReq.getQuantity());
            salesItem.setPriceAtSale(product.getSellingPrice());
            salesItems.add(salesItem);

            totalAmount += product.getSellingPrice() * itemReq.getQuantity();
        }

        // Create Sale
        Sales sale = new Sales();
        sale.setCustomerId(customer.getId());
        sale.setItems(salesItems);
        sale.setTotalAmount(totalAmount);
        sale.setCreatedAt(LocalDateTime.now());
        Sales savedSale = salesRepository.save(sale);

        // Update Customer
        customer.setTotalSpent(customer.getTotalSpent() + totalAmount);
        customer.getRecentPurchaseIds().add(savedSale.getId());
        customer.setLastVisit(LocalDateTime.now());
        customerRepository.save(customer);

        return savedSale;
    }

    public List<Sales> getAllSales() {
        return salesRepository.findAll();
    }

    public List<Sales> getSalesByCustomerId(String customerId) {
        return salesRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public Optional<Sales> getSaleById(String id) {
        return salesRepository.findById(id);
    }

    public Sales updateSale(String id, Sales sale) {
        sale.setId(id);
        return salesRepository.save(sale);
    }

    public void deleteSale(String id) {
        salesRepository.deleteById(id);
    }
}
