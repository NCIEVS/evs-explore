
package gov.nih.nci.evsexplore.web;

import gov.nih.nci.evsexplore.web.properties.WebProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;


/**
 * Entry point REST Spring Boot application.
 * excludes DataSourceAutoConfiguration to avoid DataSource bean creation.
 */

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@EnableConfigurationProperties(WebProperties.class)
public class EVSWebApplication {

    /** The Constant log. */
    private static final Logger logger = LoggerFactory.getLogger(EVSWebApplication.class);

    /**
     * Application entry point.
     *
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        logger.info("STARTING APPLICATION");
        SpringApplication.run(EVSWebApplication.class, args);
    }

}