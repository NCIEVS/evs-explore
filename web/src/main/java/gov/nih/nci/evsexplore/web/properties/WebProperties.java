
package gov.nih.nci.evsexplore.web.properties;

/**
 * Web properties. Bootstrapped via PropertiesConfiguration.
 */
public class WebProperties {

  /** The evs apibase path. */
  private String evsApibasePath;

  /** The ui license. */
  private String uiLicense;

  /**
   * Returns the evs apibase path.
   *
   * @return the evs apibase path
   */
  public String getEvsApibasePath() {
    return evsApibasePath;
  }

  /**
   * Sets the evs apibase path.
   *
   * @param evsApibasePath the evs apibase path
   */
  public void setEvsApibasePath(String evsApibasePath) {
    this.evsApibasePath = evsApibasePath;
  }

  /**
   * Returns the ui license.
   *
   * @return the ui license
   */
  public String getUiLicense() {
    return uiLicense;
  }

  /**
   * Sets the ui license.
   *
   * @param uiLicense the ui license
   */
  public void setUiLicense(String uiLicense) {
    this.uiLicense = uiLicense;
  }

}
