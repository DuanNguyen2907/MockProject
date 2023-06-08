package com.sapo.edu.demo.controller;

import com.sapo.edu.demo.dto.CheckTableDto;
import com.sapo.edu.demo.dto.ResponseObject;
import com.sapo.edu.demo.service.CheckTableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Validated
@RequestMapping("admin")
public class CheckInventoryController {
    @Autowired
    private CheckTableService checkTableService;
    @GetMapping("/check_inventory")
    public ResponseEntity<ResponseObject> getAllCheck(
            @RequestParam(defaultValue = "0", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size
    ) {
        Map<String, Object> response = checkTableService.getAllCheck(page,size);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseObject("success", "", response));
    }
    @PostMapping("/check_inventory")
    public ResponseEntity<CheckTableDto> save(@RequestBody CheckTableDto checkTableDto) {
        CheckTableDto savedCheckTable = checkTableService.save(checkTableDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCheckTable);
    }
}
