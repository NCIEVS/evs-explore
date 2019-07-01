package gov.nih.nci.evsexplore.web.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;

import gov.nih.nci.evsexplore.web.service.ConceptCodeService;
import gov.nih.nci.evsexplore.web.support.EvsConcept;
import gov.nih.nci.evsexplore.web.support.EvsRelationship;
import gov.nih.nci.evsexplore.web.support.FilterCriteriaFields;
import gov.nih.nci.evsexplore.web.support.HierarchyNode;
import gov.nih.nci.evsexplore.web.support.MatchedConcept;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/term")
public class CodeDetailController {
	
	
	private static final Logger log = LoggerFactory.getLogger(CodeDetailController.class);

	@Autowired
	ConceptCodeService conceptCodeService;
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public @ResponseBody String home() {
		return "Welcome to ReportWriter";
	}

	
	@RequestMapping(value = "/concept/{conceptCode}", method = RequestMethod.GET)
	public @ResponseBody EvsConcept getEvsConceptDetail(@PathVariable(value = "conceptCode") String conceptCode) {
		return conceptCodeService.getEvsConceptDetail(conceptCode);
		
	}
	
	@RequestMapping(value = "/concept/{conceptCode}/relationships", method = RequestMethod.GET)
	public @ResponseBody EvsRelationship getEvsConceptRelationships(@PathVariable(value = "conceptCode") String conceptCode) {
		return conceptCodeService.getEvsConceptRelationships(conceptCode);
		
	}
	
	@RequestMapping(value = "/concept/{conceptCode}/pathInHierarchy", method = RequestMethod.GET)
	public @ResponseBody List <HierarchyNode> getEvsConceptPathInHierarchy(@PathVariable(value = "conceptCode") String conceptCode) {
		return conceptCodeService.getEvsConceptPathInHierarchy(conceptCode);
	}
	
	@RequestMapping(value = "/concept/{conceptCode}/childNodes", method = RequestMethod.GET)
	public @ResponseBody List <HierarchyNode> getEvsConceptChildNodes(@PathVariable(value = "conceptCode") String conceptCode) {
		return conceptCodeService.getEvsConceptChildNodes(conceptCode);
	}	
	
	@RequestMapping(method = RequestMethod.GET, value = "/concept/search", produces = "application/json")
	public @ResponseBody List<MatchedConcept> search(@ModelAttribute FilterCriteriaFields filterCriteriaFields)
			throws IOException {
		String queryTerm = filterCriteriaFields.getTerm();
		queryTerm = escapeLuceneSpecialCharacters(queryTerm);
		filterCriteriaFields.setTerm(queryTerm);
		List<MatchedConcept> matchedConcepts = new ArrayList<MatchedConcept>();
		matchedConcepts = conceptCodeService.search(filterCriteriaFields);
		return matchedConcepts;
	}
	
	private String escapeLuceneSpecialCharacters(String before) {
		String patternString = "([+:!~*?/\\-/{}\\[\\]\\(\\)\\^\\\"])";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(before);
		StringBuffer buf = new StringBuffer();
        while(matcher.find()) {
          matcher.appendReplacement(buf,
                before.substring(matcher.start(),matcher.start(1)) +
                "\\\\" + "\\\\" + matcher.group(1)
                + before.substring(matcher.end(1),matcher.end()));
        }
        String after = matcher.appendTail(buf).toString();
        return after;
	}

}
