package com.kaushik.SmartStock.Documents;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "sales")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Sales {

    @Id
    private String id;
    private String customerId;
    private List<SalesItem> items;
    private Double totalAmount;
    private LocalDateTime createdAt;


}
