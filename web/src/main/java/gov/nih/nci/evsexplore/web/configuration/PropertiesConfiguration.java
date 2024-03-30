
package gov.nih.nci.evsexplore.web.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import gov.nih.nci.evsexplore.web.properties.WebProperties;

/**
 * Properties configuration.
 */
@Configuration
@ConfigurationProperties(prefix = "gov.nih.nci.evsexplore.web")
public class PropertiesConfiguration {

  /** The logger. */
  private static final Logger log = LoggerFactory.getLogger(PropertiesConfiguration.class);

  /**
   * Instantiates an empty {@link PropertiesConfiguration}.
   */
  public PropertiesConfiguration() {
    log.debug("Creating instance of class PropertiesConfiguration");
  }

  /**
   * Web properties.
   *
   * @return the web properties
   */
  /*
   * Stardog Properties
   */
  @Bean
  @ConfigurationProperties(prefix = "web")
  WebProperties webProperties() {
    return new WebProperties();
  }

}
