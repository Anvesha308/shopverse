package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

/** Complex search/filter queries live in ProductServiceImpl via MongoTemplate. */
public interface ProductRepository extends MongoRepository<Product, String> {
}
