package gov.nih.nci.evsexplore.web.service;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nih.nci.evsexplore.web.properties.WebProperties;
import gov.nih.nci.evsexplore.web.support.EvsConcept;
import gov.nih.nci.evsexplore.web.support.EvsRelationship;
import gov.nih.nci.evsexplore.web.support.FilterCriteriaFields;
import gov.nih.nci.evsexplore.web.support.HierarchyNode;
import gov.nih.nci.evsexplore.web.support.MatchedConcept;

@Service
public class ConceptCodeServiceImpl implements ConceptCodeService {
	
	private static final Logger log = LoggerFactory.getLogger(ConceptCodeServiceImpl.class);

	
	@Autowired
	RestTemplate restTemplate;
	
	@Autowired
	WebProperties webProperties;
	
	
	private String evsApibasePath;
	
	@PostConstruct
	public void postInit(){
		log.info("Evs Rest Api base path - " + webProperties.getEvsApibasePath());
		evsApibasePath = webProperties.getEvsApibasePath();
	}
	
	
	public EvsConcept getEvsConceptDetail(String conceptCode)  {
		
		String conceptDetailPath = webProperties.getConceptDetailPath();
		conceptDetailPath = conceptDetailPath.replaceFirst("conceptCode", conceptCode);
		
	    String url = evsApibasePath + conceptDetailPath;
	    log.info("url - " + url);
		
		EvsConcept evsConcept = restTemplate.getForObject(url, EvsConcept.class);
		
		
		
	     return evsConcept;
	}
	
	public EvsRelationship getEvsConceptRelationships(String conceptCode)  {
		
		String conceptRelationshipPath = webProperties.getConceptRelationshipPath();
		
		conceptRelationshipPath = conceptRelationshipPath.replaceFirst("conceptCode", conceptCode);
		
	    String url = evsApibasePath + conceptRelationshipPath; 
	    log.debug("url - " + url);
		
	    EvsRelationship evsRelationship = restTemplate.getForObject(url, EvsRelationship.class);
		
		
		
	     return evsRelationship;
	}
	
	public List <HierarchyNode> getEvsConceptPathInHierarchy(String conceptCode)  {
		
		String conceptPathInHierarchyPath = webProperties.getConceptPathInHierarchyPath();
		
		conceptPathInHierarchyPath = conceptPathInHierarchyPath.replaceFirst("conceptCode", conceptCode);
		
	    String url = evsApibasePath + conceptPathInHierarchyPath; 
	    log.debug("url - " + url);
	    
	    ResponseEntity<List<HierarchyNode>> response = restTemplate.exchange(
	    		url,
		        HttpMethod.GET, 
		        null, 
		        new ParameterizedTypeReference<List<HierarchyNode>>() {
	            });
		
		List<HierarchyNode> nodes = response.getBody();
		
	     return nodes;
	}

	public List <HierarchyNode> getEvsConceptChildNodes(String conceptCode)  {
		
		String conceptChildNodesPath = webProperties.getConceptChildNodesPath();
		
		conceptChildNodesPath = conceptChildNodesPath.replaceFirst("conceptCode", conceptCode);
		
	    String url = evsApibasePath + conceptChildNodesPath; 
	    log.debug("url - " + url);
	    
	    ResponseEntity<List<HierarchyNode>> response = restTemplate.exchange(
	    		url,
		        HttpMethod.GET, 
		        null, 
		        new ParameterizedTypeReference<List<HierarchyNode>>() {
	            });
		
		List<HierarchyNode> nodes = response.getBody();
		
	     return nodes;
	}
		
	public  List<MatchedConcept> search(FilterCriteriaFields filterCriteriaFields){
		
		String conceptSearchPath = webProperties.getConceptSearchPath();
		String url = evsApibasePath + conceptSearchPath; 
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("Accept", "application/json");

		HttpEntity<String> request = new HttpEntity<>(headers);
		
		log.debug("term -" + filterCriteriaFields.getTerm());
		log.debug("type -" + filterCriteriaFields.getType());
		log.debug("property -" + filterCriteriaFields.getProperty());
		log.debug("limit -" + filterCriteriaFields.getLimit());
		
		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
		        .queryParam("term", filterCriteriaFields.getTerm())
		        .queryParam("property", filterCriteriaFields.getProperty())
		        .queryParam("limit", filterCriteriaFields.getLimit())
		        .queryParam("type", filterCriteriaFields.getType());
		      

		HttpEntity<?> entity = new HttpEntity<>(headers);

		ResponseEntity<List<MatchedConcept>> response = restTemplate.exchange(
		        builder.build().encode().toUri(), 
		        HttpMethod.GET, 
		        entity, 
		        new ParameterizedTypeReference<List<MatchedConcept>>() {
	            });
		
		List<MatchedConcept> matchedConcepts = response.getBody();
		log.info("size of matched concepts - " + matchedConcepts.size());
		
		List<MatchedConcept> distinctMatchedConcepts = matchedConcepts.stream().filter(distinctByKey(p -> p.getCode())).collect(Collectors.toList());

		log.info("size of distinct matched concepts - " + distinctMatchedConcepts.size());
		
		
		return distinctMatchedConcepts;
		
	}
	
	public static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor)
    {
        Map<Object, Boolean> map = new ConcurrentHashMap<>();
        return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }


}
