package com.kaushik.SmartStock.Documents;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
@NoArgsConstructor
@Getter
@Setter
public class Product {

    @Id
    private String id;
    private String name;
    private String category;
    private Double costPrice;
    private Double sellingPrice;
    private Integer stockQuantity;
    private Integer lowStockThreshold;

}
