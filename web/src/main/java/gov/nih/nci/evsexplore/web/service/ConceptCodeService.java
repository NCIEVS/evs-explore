
package gov.nih.nci.evsexplore.web.service;

import java.util.List;

import gov.nih.nci.evsexplore.web.support.EvsConcept;
import gov.nih.nci.evsexplore.web.support.EvsRelationship;
import gov.nih.nci.evsexplore.web.support.FilterCriteriaFields;
import gov.nih.nci.evsexplore.web.support.HierarchyNode;
import gov.nih.nci.evsexplore.web.support.MatchedConcept;

/**
 * Concept code (proxy) service.
 */
public interface ConceptCodeService {

  /**
   * Returns the evs concept detail.
   *
   * @param conceptCode the concept code
   * @return the evs concept detail
   */
  public EvsConcept getEvsConceptDetail(String conceptCode);

  /**
   * Returns the evs concept relationships.
   *
   * @param conceptCode the concept code
   * @return the evs concept relationships
   */
  public EvsRelationship getEvsConceptRelationships(String conceptCode);

  /**
   * Search.
   *
   * @param filterCriteriaFields the filter criteria fields
   * @return the list
   */
  public List<MatchedConcept> search(FilterCriteriaFields filterCriteriaFields);

  /**
   * Returns the evs concept path in hierarchy.
   *
   * @param conceptCode the concept code
   * @return the evs concept path in hierarchy
   */
  public List<HierarchyNode> getEvsConceptPathInHierarchy(String conceptCode);

  /**
   * Returns the evs concept child nodes.
   *
   * @param conceptCode the concept code
   * @return the evs concept child nodes
   */
  public List<HierarchyNode> getEvsConceptChildNodes(String conceptCode);

}
