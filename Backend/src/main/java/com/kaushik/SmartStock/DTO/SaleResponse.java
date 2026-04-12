package com.kaushik.SmartStock.DTO;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleResponse {
    private String id;
    private String customerId;
    private List<SaleItemResponse> items;
    private Double totalAmount;
    private LocalDateTime createdAt;
}
