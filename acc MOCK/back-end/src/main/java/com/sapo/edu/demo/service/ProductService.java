package com.sapo.edu.demo.service;


import com.sapo.edu.demo.dto.ProductDto;
import com.sapo.edu.demo.entities.CategoryEntity;
import com.sapo.edu.demo.entities.InventoryEntity;
import com.sapo.edu.demo.entities.ProductEntity;
import com.sapo.edu.demo.exception.DuplicateException;
import com.sapo.edu.demo.exception.NotFoundException;
import com.sapo.edu.demo.repository.CategoryRepository;
import com.sapo.edu.demo.repository.InventoryRepository;
import com.sapo.edu.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor

public class ProductService {

    private final CategoryRepository categoryRepository;
    private final InventoryRepository storageRepository;

    private final ProductRepository productRepository;


    ModelMapper modelMapperProduct;

    /**
     * save new product
     * @Param productDto
     * @return
     */
    public ProductDto save(ProductDto productDto) {
        ProductEntity productEntity = new ProductEntity();
        if(productDto.getCode() != null){
            if(productRepository.findByCodeIgnoreCase(productDto.getCode()) != null){
                throw new DuplicateException("product code was exist");
            }
        }else{
            productEntity = modelMapperProduct.map(productDto,ProductEntity.class);
        }
        CategoryEntity category = categoryRepository.findByName(productDto.getCategoryName());

        CategoryEntity categoryEntity = categoryRepository.findById(category.getCode())
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + category.getCode()));

        InventoryEntity inventoryEntity = storageRepository.findById(productDto.getInventoryName())
                .orElseThrow(() -> new NotFoundException("Storage not found with id: " + productDto.getInventoryName()));


        productEntity = productRepository.save(productEntity);
        return modelMapperProduct.map(productEntity,ProductDto.class);
    }
    /**
     * delete product by code
     * @Param code
     * @return
     */

    public void delete(String code){
        productRepository.deleteByCode(code);
    }
    /**
     * find a products by code
     * @Param code
     * @return
     */
    public ProductDto findByCode(String code){
        ProductEntity productEntity = productRepository.findByCodeIgnoreCase(code).orElseThrow(() -> new RuntimeException("Product not found with id: " + code));
        return modelMapperProduct.map(productEntity,ProductDto.class);
    }

    @Autowired
    private ModelMapper modelMapper;
    /**
     * filter product by option name, category type, brand,color, range of price, range of original cost
     * @Param name, brand, categoryCode, minPrice, maxPrice,color, minOriginalCost, maxOriginalCost
     * @return
     */
    public Map<String, Object> getProductByFilter(int page, int size,String name,String code, String categoryName, String brand, BigDecimal minCost, BigDecimal maxCost,
             String color, BigDecimal minPrice, BigDecimal maxPrice) {
        Pageable paging = PageRequest.of(page, size, Sort.by(
                        Sort.Order.asc("code")
                )
        );


        Page<ProductEntity> pageProduct;
        List<ProductEntity> products = new ArrayList<ProductEntity>();
        if (categoryName != null) {
            pageProduct = productRepository.findByFilters(name,code, categoryRepository.findByName(categoryName).getCode(), brand, minCost, maxCost, color, minPrice, maxPrice, paging);

        } else {
            pageProduct = productRepository.findByFilters(name,code, null, brand, minCost, maxCost, color, minPrice, maxPrice, paging);
        }

        products = pageProduct.getContent();
        System.out.println(products);
        // Mapping qua Dto
        Map<String, Object> response = new HashMap<>();
        List<ProductDto> productsDtos = Arrays.asList(modelMapper.map(products, ProductDto[].class));
        for(ProductDto productDto : productsDtos) {
            productDto.setCategoryName(getCategoryNameByCode(productDto.getCategoryCode()));
        }
        response.put("products", productsDtos);
        response.put("currentPage", pageProduct.getNumber());
        response.put("totalItems", pageProduct.getTotalElements());
        response.put("totalPages", pageProduct.getTotalPages());
        return response;
    }
    private String getCategoryNameByCode(String categoryCode) {
        // Thực hiện truy vấn đến category repository để lấy category name theo category code
        CategoryEntity category = categoryRepository.findByCode(categoryCode).get();
        System.out.println(category.getName());
        if (category != null) {
            return category.getName();
        }
        return null;
    }

    public Integer getTotalSold(){
        return productRepository.totalSold();
    }

    public Integer getTotalQuantity(){
        return productRepository.totalQuantity();
    }

    public List<Object> getTop3Product(){
        return productRepository.findTopProducts().subList(0, 3);
    }

    public List<Object> getTop3Customer(){
        return productRepository.findTopCustomers().subList(0, 3);
    }

<<<<<<< HEAD
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductEntity> getProductByCode(String code){
        return productRepository.findByCodeContaining(code);
    }
=======

>>>>>>> 35d18dc1e6db131ccbb860251de69fbdd0b879c8
}

