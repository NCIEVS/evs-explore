
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

  /** The resource properties. */
  private final Resources resourceProperties = new Resources();

  /* see superclass */
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // Add all static files
    // Long cachePeriodLong =
    // resourceProperties.getCache().getPeriod().getSeconds();

    Long cachePeriodLong = 30L;
    int cachePeriodInt = cachePeriodLong.intValue();
    CacheControl cacheControl = CacheControl.maxAge(cachePeriodLong, TimeUnit.SECONDS);

    registry.addResourceHandler("/**")
            .addResourceLocations(resourceProperties.getStaticLocations())
            .setCacheControl(cacheControl)
            .resourceChain(true);

//    // Create mapping to index.html for Angular HTML5 mode.
//    String[] indexLocations = getIndexLocations();
//    registry.addResourceHandler("/**")
//            .addResourceLocations(indexLocations)
//            .setCacheControl(cacheControl)
//            .resourceChain(true)
//            .addResolver(new PathResourceResolver() {
//          @Override
//          protected Mono<Resource> getResource(String resourcePath, Resource location) {
//            return location.exists() && location.isReadable() ? Mono.just(location) : null;
//          }
//        });
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