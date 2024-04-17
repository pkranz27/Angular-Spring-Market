package com.philpkranz.ecommerce.configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.philpkranz.ecommerce.model.Country;
import com.philpkranz.ecommerce.model.Product;
import com.philpkranz.ecommerce.model.ProductCategory;
import com.philpkranz.ecommerce.model.State;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer{
	private EntityManager entityManager;
	
	@Autowired
	public MyDataRestConfig(EntityManager theEntityManager) {
		entityManager = theEntityManager;
	}
	
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors){
	
		HttpMethod[] theUnsupportedActions = {HttpMethod.PUT,HttpMethod.POST, HttpMethod.DELETE};
		
		// disable Http Methods for Product: Put, Post and Delete
		disableHttpsMethods(Product.class,config, theUnsupportedActions);
		disableHttpsMethods(ProductCategory.class,config, theUnsupportedActions);
		
		disableHttpsMethods(Country.class,config, theUnsupportedActions);
		disableHttpsMethods(State.class,config, theUnsupportedActions);
		
		// call an internal helper method
		exposeIds(config);
	}
	// disable Http Methods for Product: Put, Post and Delete
	private void disableHttpsMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
		config.getExposureConfiguration()
			.forDomainType(theClass)
			.withItemExposure((metdata, httpMethods) ->httpMethods.disable(theUnsupportedActions))
			.withCollectionExposure((metdata, httpMethods)-> httpMethods.disable(theUnsupportedActions));
	} 
	private void exposeIds(RepositoryRestConfiguration config) {
		// expose entity ids 
		
		// get a list of all entity classes from the entity
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
		
		// create an array of the entity types
		List<Class>entityClasses = new ArrayList<>();
		
		// get the entity types for the entities
		for(EntityType tempEntityType: entities) {
			entityClasses.add(tempEntityType.getJavaType());
		}
		//expose the entity ids for the array of the entity/ domain types
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes); 
		
	}
}

