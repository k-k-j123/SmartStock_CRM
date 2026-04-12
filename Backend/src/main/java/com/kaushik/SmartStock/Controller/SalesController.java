package com.kaushik.SmartStock.Controller;

import com.kaushik.SmartStock.DTO.SaleItemResponse;
import com.kaushik.SmartStock.DTO.SaleRequest;
import com.kaushik.SmartStock.DTO.SaleResponse;
import com.kaushik.SmartStock.Documents.Sales;
import com.kaushik.SmartStock.Service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesService salesService;

    @PostMapping()
    public ResponseEntity<SaleResponse> createSale(@RequestBody SaleRequest saleRequest) {
        Sales sale = salesService.createSale(saleRequest);
        return ResponseEntity.ok(convertToResponse(sale));
    }

    @GetMapping()
    public ResponseEntity<List<SaleResponse>> getAllSales() {
        List<SaleResponse> responses = salesService.getAllSales().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaleResponse> getSaleById(@PathVariable String id) {
        return salesService.getSaleById(id)
                .map(sale -> ResponseEntity.ok(convertToResponse(sale)))
                .orElse(ResponseEntity.notFound().build());
    }

    private SaleResponse convertToResponse(Sales sale) {
        SaleResponse response = new SaleResponse();
        response.setId(sale.getId());
        response.setCustomerId(sale.getCustomerId());
        response.setTotalAmount(sale.getTotalAmount());
        response.setCreatedAt(sale.getCreatedAt());
        response.setItems(sale.getItems().stream().map(item -> {
            SaleItemResponse itemRes = new SaleItemResponse();
            itemRes.setProductId(item.getProductId());
            itemRes.setName(item.getName());
            itemRes.setQuantity(item.getQuantity());
            itemRes.setPriceAtSale(item.getPriceAtSale());
            return itemRes;
        }).collect(Collectors.toList()));
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSale(@PathVariable String id) {
        salesService.deleteSale(id);
        return ResponseEntity.ok("Sale deleted successfully");
    }
}
