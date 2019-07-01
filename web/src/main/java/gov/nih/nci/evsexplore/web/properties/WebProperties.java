package gov.nih.nci.evsexplore.web.properties;

public class WebProperties {
	
	
	private String evsApibasePath;
	private String conceptDetailPath;
	private String conceptRelationshipPath;
	private String conceptSearchPath;
	private String conceptPathInHierarchyPath;
	private String conceptChildNodesPath;
	
	
	public String getEvsApibasePath() {
		return evsApibasePath;
	}
	public void setEvsApibasePath(String evsApibasePath) {
		this.evsApibasePath = evsApibasePath;
	}
	public String getConceptDetailPath() {
		return conceptDetailPath;
	}
	public void setConceptDetailPath(String conceptDetailPath) {
		this.conceptDetailPath = conceptDetailPath;
	}

	public String getConceptRelationshipPath() {
		return conceptRelationshipPath;
	}

	public void setConceptRelationshipPath(String conceptRelationshipPath) {
		this.conceptRelationshipPath = conceptRelationshipPath;
	}

	public String getConceptSearchPath() {
		return conceptSearchPath;
	}

	public void setConceptSearchPath(String conceptSearchPath) {
		this.conceptSearchPath = conceptSearchPath;
	}

	public String getConceptPathInHierarchyPath() {
		return conceptPathInHierarchyPath;
	}

	public void setConceptPathInHierarchyPath(String conceptPathInHierarchyPath) {
		this.conceptPathInHierarchyPath = conceptPathInHierarchyPath;
	}

	public String getConceptChildNodesPath() {
		return conceptChildNodesPath;
	}

	public void setConceptChildNodesPath(String conceptChildNodesPath) {
		this.conceptChildNodesPath = conceptChildNodesPath;
	}	

}
