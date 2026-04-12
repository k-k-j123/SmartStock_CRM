package com.kaushik.SmartStock.Documents;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class SalesItem {

    private String productId;
    private String name;
    private Integer quantity;
    private Double priceAtSale;

}