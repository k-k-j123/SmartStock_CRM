package com.kaushik.SmartStock.Documents;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    private String id;

    private String name;
    private String phone;
    private String email;

    private Double totalSpent=0.0;
    private LocalDateTime lastVisit;

    private List<String> recentPurchaseIds = new ArrayList<>();

    public boolean isLoyalCustomer() {
        return recentPurchaseIds.size() >= 3;
    }

}
