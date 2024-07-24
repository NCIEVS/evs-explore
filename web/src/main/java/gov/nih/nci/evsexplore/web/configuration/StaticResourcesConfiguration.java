
package gov.nih.nci.evsexplore.web.configuration;

import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.autoconfigure.web.WebProperties.Resources;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

/**
 * Static resource config.
 */
@Configuration
@EnableConfigurationProperties({
        WebProperties.class
})
public class StaticResourcesConfiguration implements WebMvcConfigurer {

    /**
     * The Constant STATIC_RESOURCES. Need to be explicitly listed to ensure our routes will
     * set the MIME type correctly
     */

    static final String[] STATIC_RESOURCES = new String[] {
            "/**/*.css", "/**/*.html", "/**/*.js", "/**/*.json", "/**/*.bmp",
            "/**/*.jpeg", "/**/*.jpg", "/**/*.png", "/**/*.ttf", "/**/*.eot",
            "/**/*.svg", "/**/*.woff", "/**/*.woff2"
    };

    /**
     * The resource properties.
     */
    private final Resources resourceProperties = new Resources();

    /**
     * Add handlers for serving static resources from /static/ folder and
     * implement Single Page Application (SPA) routing.
     *
     * @param registry the resource handler registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Set the cache period
        Long cachePeriodLong = 30L;
        int cachePeriodInt = cachePeriodLong.intValue();
        CacheControl cacheControl = CacheControl.maxAge(cachePeriodLong, TimeUnit.SECONDS);
        Integer cachePeriod = cachePeriodInt;

        // Load all static resources
        registry.addResourceHandler(STATIC_RESOURCES)
                .addResourceLocations(resourceProperties.getStaticLocations())
                .setCacheControl(cacheControl)
                .resourceChain(true);

        // Create mapping to index.html for Angular HTML5 mode. All urls route to the index page (SPA).
        String[] indexLocations = getIndexLocations();
        registry.addResourceHandler("/**")
                .addResourceLocations(indexLocations)
                .setCachePeriod(cachePeriod)
                .resourceChain(true)
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