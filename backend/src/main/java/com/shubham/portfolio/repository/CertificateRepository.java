package com.shubham.portfolio.repository;

import com.shubham.portfolio.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findAllByOrderByDisplayOrderAsc();

    List<Certificate> findByCategoryOrderByDisplayOrderAsc(Certificate.Category category);
}
