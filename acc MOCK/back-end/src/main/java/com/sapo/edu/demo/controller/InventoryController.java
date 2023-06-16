package com.sapo.edu.demo.controller;


import com.sapo.edu.demo.dto.InventoryDto;
import com.sapo.edu.demo.dto.ResponseObject;

import com.sapo.edu.demo.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@Validated
@RequestMapping("admin")
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;
    @PostMapping("/inventories")
    public ResponseEntity<ResponseObject> save(@RequestBody InventoryDto inventory) {
        inventoryService.save(inventory);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseObject("success", "", inventory));
    }
    @GetMapping("/inventories")
    public ResponseEntity<ResponseObject> getAllProducts() {
        Map<String, Object> response = inventoryService.getAllInventories();
        return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseObject("success", "", response));
    }
}