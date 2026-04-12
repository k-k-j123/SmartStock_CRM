package com.kaushik.SmartStock.DTO;

import lombok.Data;

@Data
public class SaleItemRequest {
    private String productId;
    private Integer quantity;
}
