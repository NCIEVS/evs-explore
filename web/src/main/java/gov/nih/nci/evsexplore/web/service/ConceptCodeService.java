package gov.nih.nci.evsexplore.web.service;

import java.util.List;

import gov.nih.nci.evsexplore.web.support.EvsConcept;
import gov.nih.nci.evsexplore.web.support.EvsRelationship;
import gov.nih.nci.evsexplore.web.support.FilterCriteriaFields;
import gov.nih.nci.evsexplore.web.support.HierarchyNode;
import gov.nih.nci.evsexplore.web.support.MatchedConcept;

public interface ConceptCodeService {
	
	public EvsConcept getEvsConceptDetail(String conceptCode);
	public EvsRelationship getEvsConceptRelationships(String conceptCode);
	public  List<MatchedConcept> search(FilterCriteriaFields filterCriteriaFields);
	public List<HierarchyNode> getEvsConceptPathInHierarchy(String conceptCode);
	public List<HierarchyNode> getEvsConceptChildNodes(String conceptCode);	

}
