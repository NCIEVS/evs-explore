package gov.nih.nci.evsexplore.web.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import gov.nih.nci.evsexplore.web.properties.WebProperties;



@Configuration
@EnableConfigurationProperties
public class PropertiesConfiguration {

    /** The logger. */
    private static final Logger log = LoggerFactory.getLogger(PropertiesConfiguration.class);

    public PropertiesConfiguration() {
        log.debug("Creating instance of class PropertiesConfiguration");
    }


    /*
     * Stardog  Properties
     */
    @Bean
    @ConfigurationProperties(prefix = "gov.nih.nci.evsexplore.web", ignoreUnknownFields = false)
    WebProperties webProperties() {
        return new WebProperties();
    }
    
    

    
   

}
