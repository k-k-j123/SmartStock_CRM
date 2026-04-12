package com.kaushik.SmartStock.DTO;

import lombok.Data;

@Data
public class SaleItemResponse {
    private String productId;
    private String name;
    private Integer quantity;
    private Double priceAtSale;
}
