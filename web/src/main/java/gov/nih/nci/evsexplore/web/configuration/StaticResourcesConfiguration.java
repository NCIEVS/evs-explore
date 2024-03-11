
package gov.nih.nci.evsexplore.web.configuration;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.autoconfigure.web.WebProperties.Resources;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Static resources config.
 */
@Configuration
@EnableConfigurationProperties({
    WebProperties.class
})
public class StaticResourcesConfiguration implements WebMvcConfigurer {

  /** The Constant STATIC_RESOURCES. */
  static final String[] STATIC_RESOURCES = new String[] {
      "/**/*.css", "/**/*.html", "/**/*.js", "/**/*.json", "/**/*.bmp",
      "/**/*.jpeg", "/**/*.jpg", "/**/*.png", "/**/*.ttf", "/**/*.eot",
      "/**/*.svg", "/**/*.woff", "/**/*.woff2"
  };

  /** The resource properties. */
  private Resources resourceProperties = new Resources();

  /* see superclass */
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // Add all static files
    // Long cachePeriodLong =
    // resourceProperties.getCache().getPeriod().getSeconds();
    Long cachePeriodLong = 30L;
    int cachePeriodInt = cachePeriodLong.intValue();
    Integer cachePeriod = Integer.valueOf(cachePeriodInt);

    registry.addResourceHandler(STATIC_RESOURCES)
        .addResourceLocations(resourceProperties.getStaticLocations())
        .setCachePeriod(cachePeriod);

    // Create mapping to index.html for Angular HTML5 mode.
    String[] indexLocations = getIndexLocations();
    registry.addResourceHandler("/**").addResourceLocations(indexLocations)
        .setCachePeriod(cachePeriod).resourceChain(true)
        .addResolver(new PathResourceResolver() {
          @Override
          protected Resource getResource(String resourcePath, Resource location)
            throws IOException {
            return location.exists() && location.isReadable() ? location : null;
          }
        });
  }

  /**
   * Returns the index locations.
   *
   * @return the index locations
   */
  private String[] getIndexLocations() {
    return Arrays.stream(resourceProperties.getStaticLocations())
        .map((location) -> location + "index.html").toArray(String[]::new);
  }
}