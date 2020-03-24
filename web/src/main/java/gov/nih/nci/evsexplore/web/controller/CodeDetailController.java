
package gov.nih.nci.evsexplore.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.evsexplore.web.service.ConceptCodeService;
import gov.nih.nci.evsexplore.web.support.EvsConcept;
import gov.nih.nci.evsexplore.web.support.EvsRelationship;
import gov.nih.nci.evsexplore.web.support.FilterCriteriaFields;
import gov.nih.nci.evsexplore.web.support.HierarchyNode;
import gov.nih.nci.evsexplore.web.support.MatchedConcept;

/**
 * Code detail controller.
 */
@RestController
@RequestMapping("/term")
public class CodeDetailController {

  /** The Constant log. */
  @SuppressWarnings("unused")
  private static Logger log =
      LoggerFactory.getLogger(CodeDetailController.class);

  /** The concept code service. */
  @Autowired
  ConceptCodeService conceptCodeService;

  /**
   * Home.
   *
   * @return the string
   */
  @RequestMapping(value = "/", method = RequestMethod.GET)
  public @ResponseBody String home() {
    return "Welcome to ReportWriter";
  }

  /**
   * Returns the evs concept detail.
   *
   * @param conceptCode the concept code
   * @return the evs concept detail
   */
  @RequestMapping(value = "/concept/{conceptCode}", method = RequestMethod.GET)
  public @ResponseBody EvsConcept getEvsConceptDetail(
    @PathVariable(value = "conceptCode") String conceptCode) {
    return conceptCodeService.getEvsConceptDetail(conceptCode);

  }

  /**
   * Returns the evs concept relationships.
   *
   * @param conceptCode the concept code
   * @return the evs concept relationships
   */
  @RequestMapping(value = "/concept/{conceptCode}/relationships", method = RequestMethod.GET)
  public @ResponseBody EvsRelationship getEvsConceptRelationships(
    @PathVariable(value = "conceptCode") String conceptCode) {
    return conceptCodeService.getEvsConceptRelationships(conceptCode);

  }

  /**
   * Returns the evs concept path in hierarchy.
   *
   * @param conceptCode the concept code
   * @return the evs concept path in hierarchy
   */
  @RequestMapping(value = "/concept/{conceptCode}/pathInHierarchy", method = RequestMethod.GET)
  public @ResponseBody List<HierarchyNode> getEvsConceptPathInHierarchy(
    @PathVariable(value = "conceptCode") String conceptCode) {
    return conceptCodeService.getEvsConceptPathInHierarchy(conceptCode);
  }

  /**
   * Returns the evs concept child nodes.
   *
   * @param conceptCode the concept code
   * @return the evs concept child nodes
   */
  @RequestMapping(value = "/concept/{conceptCode}/childNodes", method = RequestMethod.GET)
  public @ResponseBody List<HierarchyNode> getEvsConceptChildNodes(
    @PathVariable(value = "conceptCode") String conceptCode) {
    return conceptCodeService.getEvsConceptChildNodes(conceptCode);
  }

  /**
   * Search.
   *
   * @param filterCriteriaFields the filter criteria fields
   * @return the list
   * @throws IOException Signals that an I/O exception has occurred.
   */
  @RequestMapping(method = RequestMethod.GET, value = "/concept/search", produces = "application/json")
  public @ResponseBody List<MatchedConcept> search(
    @ModelAttribute FilterCriteriaFields filterCriteriaFields)
    throws IOException {
    String queryTerm = filterCriteriaFields.getTerm();
    queryTerm = escapeLuceneSpecialCharacters(queryTerm);
    filterCriteriaFields.setTerm(queryTerm);
    List<MatchedConcept> matchedConcepts = new ArrayList<MatchedConcept>();
    matchedConcepts = conceptCodeService.search(filterCriteriaFields);
    return matchedConcepts;
  }

  /**
   * Escape lucene special characters.
   *
   * @param before the before
   * @return the string
   */
  private String escapeLuceneSpecialCharacters(String before) {
    String patternString = "([+:!~*?/\\-/{}\\[\\]\\(\\)\\^\\\"])";
    Pattern pattern = Pattern.compile(patternString);
    Matcher matcher = pattern.matcher(before);
    StringBuffer buf = new StringBuffer();
    while (matcher.find()) {
      matcher.appendReplacement(buf,
          before.substring(matcher.start(), matcher.start(1)) + "\\\\" + "\\\\"
              + matcher.group(1)
              + before.substring(matcher.end(1), matcher.end()));
    }
    String after = matcher.appendTail(buf).toString();
    return after;
  }

}
