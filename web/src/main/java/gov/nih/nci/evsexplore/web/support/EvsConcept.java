package gov.nih.nci.evsexplore.web.support;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EvsConcept {

	private String code;
	private String label;
	private List <EvsDefinition> definitions;
	private String displayName;
	private String preferredName;
	private boolean isDiseaseStage;
	private boolean isDiseaseGrade;
	private boolean isMainType;
	private boolean isSubtype;
	private boolean isDisease;
	private boolean isBiomarker;
	private boolean isReferenceGene;

	private List <Paths> mainMenuAncestors;
	
	private String neoplasticStatus;
	private List <EvsSubconcept> subconcepts;
	private List <EvsSuperconcept> superconcepts;
	private List <String> semanticTypes;
	private List <String> conceptStatus;
	private List <EvsSynonym> synonyms;
	private List <EvsAdditionalProperty> additionalProperties;

	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public List <EvsDefinition> getDefinitions() {
		return definitions;
	}
	public void setDefinitions(List<EvsDefinition> definitions) {
		this.definitions = definitions;
	}
	public String getDisplayName() {
		return displayName;
	}
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	public String getPreferredName() {
		return preferredName;
	}
	public void setPreferredName(String preferredName) {
		this.preferredName = preferredName;
	}
	
	@JsonIgnore
	public String getNeoplasticStatus() {
		return neoplasticStatus;
	}
	public void setNeoplasticStatus(String neoplasticStatus) {
		this.neoplasticStatus = neoplasticStatus;
	}
	public List<EvsSubconcept> getSubconcepts() {
		return subconcepts;
	}
	public void setSubconcepts(List<EvsSubconcept> subconcepts) {
		this.subconcepts = subconcepts;
	}
	public List<EvsSuperconcept> getSuperconcepts() {
		return superconcepts;
	}
	public void setSuperconcepts(List<EvsSuperconcept> superconcepts) {
		this.superconcepts = superconcepts;
	}
	public List<String> getSemanticTypes() {
		return semanticTypes;
	}
	public void setSemanticTypes(List<String> semanticTypes) {
		this.semanticTypes = semanticTypes;
	}
	public List<String> getConceptStatus() {
		return conceptStatus;
	}
	public void setConceptStatus(List<String> conceptStatus) {
		this.conceptStatus = conceptStatus;
	}
	public List<EvsSynonym> getSynonyms() {
		return synonyms;
	}
	public void setSynonyms(List<EvsSynonym> synonyms) {
		this.synonyms = synonyms;
	}
	public List <EvsAdditionalProperty> getAdditionalProperties() {
		return additionalProperties;
	}
	public void setAdditionalProperties(List <EvsAdditionalProperty> additionalProperties) {
		this.additionalProperties = additionalProperties;
	}
	public boolean getIsDiseaseStage() {
		return isDiseaseStage;
	}
	public void setIsDiseaseStage(boolean isDiseaseStage) {
		this.isDiseaseStage = isDiseaseStage;
	}
	
	public boolean getIsDiseaseGrade() {
		return isDiseaseGrade;
	}
	
	public void setIsDiseaseGrade(boolean isDiseaseGrade) {
		this.isDiseaseGrade = isDiseaseGrade;
	}
	
	public boolean getIsMainType() {
		return isMainType;
	}
	public void setIsMainType(boolean isMainType) {
		this.isMainType = isMainType;
	}

	public boolean getIsSubtype() {
		return isSubtype;
	}
	public void setIsSubtype(boolean isSubtype) {
		this.isSubtype = isSubtype;
	}
	public boolean getIsDisease() {
		return isDisease;
	}
	public void setIsDisease(boolean isDisease) {
		this.isDisease = isDisease;
	}
	public boolean getIsBiomarker() {
		return isBiomarker;
	}
	public void setIsBiomarker(boolean isBiomarker) {
		this.isBiomarker = isBiomarker;
	}
	public boolean getIsReferenceGene() {
		return isReferenceGene;
	}
	public void setIsReferenceGene(boolean isReferenceGene) {
		this.isReferenceGene = isReferenceGene;
	}
	public List<Paths> getMainMenuAncestors() {
		return mainMenuAncestors;
	}
	public void setMainMenuAncestors(List<Paths> mainMenuAncestors) {
		this.mainMenuAncestors = mainMenuAncestors;
	}
	
}
