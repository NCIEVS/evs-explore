
package gov.nih.nci.evsexplore.web;

import gov.nih.nci.evsexplore.web.configuration.PropertiesConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * Entry point REST application.
 */
@SpringBootApplication(exclude = {
        // This is to avoid "Failed to configure a DataSource: 'url' attribute is not specified and no
        // embedded datasource could be configured" error after using Spring Cloud Gateway
        DataSourceAutoConfiguration.class})
@EnableConfigurationProperties(PropertiesConfiguration.class)
public class Application extends SpringBootServletInitializer {

  /** The Constant log. */
  private static final Logger log = LoggerFactory.getLogger(Application.class);

  /**
   * Application entry point.
   *
   * @param args the command line arguments
   */
  public static void main(String[] args) {
    log.info("STARTING APPLICATION");
    SpringApplication.run(Application.class, args);
  }

  /**
   * Configure.
   *
   * @param application the application
   * @return the spring application builder
   */
  /* see superclass */
  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(Application.class);
  }

}