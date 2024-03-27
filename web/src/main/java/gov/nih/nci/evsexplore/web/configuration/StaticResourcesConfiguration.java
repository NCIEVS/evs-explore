
package gov.nih.nci.evsexplore.web.configuration;

import java.io.IOException;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.autoconfigure.web.WebProperties.Resources;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.web.reactive.config.ResourceHandlerRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.resource.PathResourceResolver;
import reactor.core.publisher.Mono;

/**
 * Static resources config.
 */
@Configuration
@EnableConfigurationProperties({
    WebProperties.class
})
public class StaticResourcesConfiguration implements WebFluxConfigurer {

  /**
   * The Constant STATIC_RESOURCES.
   * PathPatternParse is used by default, which doesn't support /** at the beginning of a pattern.
   * Need to have our patterns start with a specific path.
   */

  static final String STATIC_RESOURCES = "/evsexplore/**";

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
    CacheControl cacheControl = CacheControl.maxAge(cachePeriodLong, TimeUnit.SECONDS);

    registry.addResourceHandler(STATIC_RESOURCES)
            .addResourceLocations(resourceProperties.getStaticLocations())
            .setCacheControl(cacheControl);

    // Create mapping to index.html for Angular HTML5 mode.
    String[] indexLocations = getIndexLocations();
    registry.addResourceHandler("/**")
            .addResourceLocations(indexLocations)
            .setCacheControl(cacheControl)
            .resourceChain(true)
            .addResolver(new PathResourceResolver() {
          @Override
          protected Mono<Resource> getResource(String resourcePath, Resource location) {
            return location.exists() && location.isReadable() ? (Mono<Resource>) location : null;
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