package com.sapo.edu.demo.repository;
import com.sapo.edu.demo.entities.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import java.math.BigDecimal;
import org.springframework.data.jpa.repository.Modifying;


import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, String> {
    Optional<ProductEntity> findByCodeIgnoreCase(String code);
    Optional<ProductEntity> findProductCodeByCode(String code);
    Optional<ProductEntity> findByBrandContainingIgnoreCase(String code);

    Optional<ProductEntity> deleteAllByInventoryName(String inventoryName);
    Optional<ProductEntity> deleteByCode(String code);

    ProductEntity findByCode(String code);

    @Query("SELECT p.code , p.name, pa.price, pa.id, pa.size, pa.color, pa.quantity, pa.sold " +
            "FROM ProductAttribute pa " +
            "INNER JOIN ProductEntity p ON p.code = pa.productCode " +
            "WHERE p.code LIKE %:code%")
    List<Object[]> findByCodeContaining(String code);

    @Query("select p.name, sum(pa.quantity) as total "
            + "from ProductEntity p join ProductAttribute pa on p.code = pa.productCode "
            + "group by p.code order by total desc")
    List<Object> findTopProductsByQuantity();

}
