
package gov.nih.nci.evsexplore.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.evsexplore.web.controller.CodeDetailController;

/**
 * Entry point REST application.
 */
@EnableZuulProxy
@SpringBootApplication
public class Application extends SpringBootServletInitializer {

  /** The Constant log. */
  private static final Logger log =
      LoggerFactory.getLogger(CodeDetailController.class);

  /**
   * Application entry point.
   *
   * @param args the command line arguments
   */
  public static void main(String[] args) {
    log.info("STARTING APPLICATION");
    SpringApplication.run(Application.class, args);
  }

  /* see superclass */
  @Override
  protected SpringApplicationBuilder configure(
    SpringApplicationBuilder application) {
    return application.sources(Application.class);
  }

  /**
   * Rest template.
   *
   * @param builder the builder
   * @return the rest template
   */
  @Bean
  public RestTemplate restTemplate(RestTemplateBuilder builder) {
    return builder.build();
  }

}