package com.kaushik.SmartStock.DTO;

import lombok.Data;
import java.util.List;

@Data
public class SaleRequest {
    private String customerId;
    private String customerPhone;
    private String customerName;
    private List<SaleItemRequest> items;
}
