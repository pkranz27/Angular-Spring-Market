package com.philpkranz.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.philpkranz.ecommerce.model.Country;
@Repository
@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel="countries", path="countries")
public interface CountryRepository extends JpaRepository<Country, Integer> {

}
