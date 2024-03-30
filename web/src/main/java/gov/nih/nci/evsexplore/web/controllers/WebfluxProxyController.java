package gov.nih.nci.evsexplore.web.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.webflux.ProxyExchange;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.net.URI;

@RestController
public class WebfluxProxyController {
    /**
     * The logger.
     */
    private static final Logger logger = LoggerFactory.getLogger(WebfluxProxyController.class);

    /**
     * The evs rest api uri.
     */
    @Value("${spring.cloud.gateway.routes[0].uri}")
    private URI evsRestApiUri;

    /**
     * proxy forwarding for calls to the evs rest api.
     *
     * @return the mono response entity
     */
    @GetMapping("api/v1/**")
    public Mono<ResponseEntity<byte[]>> proxyPath(ProxyExchange<byte[]> proxy) throws Exception {
        logger.info("Proxy path: " + proxy.path());
        logger.info("EVSRESTAPI URI: " + evsRestApiUri.toString());

        return proxy.uri(evsRestApiUri.toString() + proxy.path()).get();
    }
}
