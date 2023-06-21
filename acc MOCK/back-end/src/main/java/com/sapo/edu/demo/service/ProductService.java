package com.sapo.edu.demo.service;

import com.sapo.edu.demo.dto.product.CreateProduct;
import com.sapo.edu.demo.entities.ProductAttribute;
import com.sapo.edu.demo.entities.ProductEntity;
import com.sapo.edu.demo.repository.CategoryRepository;
import com.sapo.edu.demo.repository.ProductAttributeRepository;
import com.sapo.edu.demo.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.sapo.edu.demo.dto.ProductDto;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class ProductService {

    private CategoryRepository categoryRepository;

    private ProductRepository productRepository;

    private ProductAttributeRepository productAttributeRepository;

    public void delete(String code){
        productRepository.deleteByCode(code);
    }

    ModelMapper modelMapperProduct = new ModelMapper();

    public ProductService(CategoryRepository categoryRepository, ProductRepository productRepository, ProductAttributeRepository productAttributeRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.productAttributeRepository = productAttributeRepository;
    }

    public Page<ProductEntity> getAllInPage(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    public ProductEntity getProductByCode(String code) {
        return productRepository.findByCode(code);
    }

    public ProductEntity saveProduct(CreateProduct p) {
        ProductEntity productEntity = new ProductEntity();
        Long count = productRepository.count();
        count = count + 1;
        String code = "P" + count.toString();
        productEntity.setCode(code);
        productEntity.setName(p.getName());
        productEntity.setBrand(p.getBrand());
        productEntity.setImage(p.getImage());
        productEntity.setCategoryCode(p.getCategoryCode());
        productEntity.setCreateAt(LocalDate.now());
        return productRepository.save(productEntity);
    }

    public List<ProductDto> getAllProductsByCode(String code){
        List<ProductEntity> products = productRepository.findByCodeContaining(code);
        List<ProductDto> productDtos = new ArrayList<ProductDto>();
        for(ProductEntity product : products) {

            List<ProductAttribute> attributes = productAttributeRepository.findByProductCode(product.getCode());

            List<ProductDto> Dtos = Arrays.asList(modelMapperProduct.map(attributes,ProductDto[].class));
            for(ProductAttribute attribute : attributes) {
                ProductDto dto = modelMapperProduct.map(product,ProductDto.class);
                dto.setInventoryName(attribute.getInventoryName());
                dto.setPrice(attribute.getPrice());
                dto.setQuantity(attribute.getQuantity());
                dto.setID(attribute.getId());
                dto.setSize(attribute.getSize());
                dto.setColor(attribute.getColor());
//                dto.setImage(attribute.getImage());
                dto.setPrice(attribute.getPrice());
                dto.setOriginalCost(attribute.getOriginalCost());
                productDtos.add(dto);
            }

        }
        return productDtos;
    }

    public List<Object> getTop3ProductByQuantity() {
        return productRepository.findTopProductsByQuantity().subList(0, 3);
    }

    public ProductEntity updateProduct(ProductEntity productEntity){
        productEntity.setUpdateAt(LocalDate.now());
        return productRepository.save(productEntity);
    }
}

