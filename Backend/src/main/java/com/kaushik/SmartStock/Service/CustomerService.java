package com.kaushik.SmartStock.Service;

import com.kaushik.SmartStock.Documents.Customer;
import com.kaushik.SmartStock.Repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public void deleteCustomer(String id) {
        customerRepository.deleteById(id);
    }

    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustByPhone(String phone) {
        return customerRepository.findByPhone(phone);
    }

    public Optional<Customer> getCustomerById(String id){
        return customerRepository.findById(id);
    }

    public List<Customer> searchCustomers(String query) {
        return customerRepository.findByNameContainingIgnoreCaseOrPhoneContaining(query, query);
    }

}
