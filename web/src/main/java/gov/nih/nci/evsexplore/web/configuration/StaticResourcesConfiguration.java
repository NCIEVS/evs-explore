package gov.nih.nci.evsexplore.web.configuration;

import java.util.concurrent.TimeUnit;

import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Static resource config. */
@Configuration
@EnableConfigurationProperties({WebProperties.class})
public class StaticResourcesConfiguration implements WebMvcConfigurer {

  /** The resource properties. */
  private final WebProperties.Resources resourceProperties = new WebProperties.Resources();

  /** The Constant STATIC_RESOURCES. */
  static final String[] STATIC_RESOURCES =
      new String[] {
        "/**/*.css", "/**/*.html", "/**/*.js", "/**/*.json", "/**/*.bmp",
        "/**/*.jpeg", "/**/*.jpg", "/**/*.png", "/**/*.ttf", "/**/*.eot",
        "/**/*.svg", "/**/*.woff", "/**/*.woff2", "/**/*.xls"
      };

  /* see superclass */
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    Long cachePeriodLong = 30L;
    CacheControl cacheControl = CacheControl.maxAge(cachePeriodLong, TimeUnit.SECONDS);

    // This handler explicitly serves your static assets.
    registry
        .addResourceHandler(STATIC_RESOURCES)
        .addResourceLocations(resourceProperties.getStaticLocations())
        .setCacheControl(cacheControl)
        .resourceChain(true);
  }

  /* see superclass */
  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    // This view controller is the key to solving your problem.
    // It is a clean way to tell Spring to forward any path that doesn't
    // match a static resource or an API endpoint to the index.html file.
    registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/index.html");

    // Add a second view controller to catch any multi-level paths that do not contain a period.
    registry
        .addViewController("/{path:[^\\.]*}/**/{path2:[^\\.]*}")
        .setViewName("forward:/index.html");
    // Add explicit mapping for concept routes that may contain dots
    registry.addViewController("/concept/**").setViewName("forward:/index.html");
  }
}
