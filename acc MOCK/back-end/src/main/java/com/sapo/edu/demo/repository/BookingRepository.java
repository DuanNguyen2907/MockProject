package com.sapo.edu.demo.repository;
import com.sapo.edu.demo.entities.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, String> {
    BookingEntity findByCode(String code);

}
