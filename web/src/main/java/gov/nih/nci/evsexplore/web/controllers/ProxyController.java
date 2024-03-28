package gov.nih.nci.evsexplore.web.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.URI;

@RestController
public class ProxyController {
    /**
     * The evs rest api uri.
     */
    @Value("${spring.cloud.gateway.routes[0].uri}")
    private URI evsRestApiUri;

    /**
     * The web client.
     */
    private final WebClient webClient;

    /**
     * Instantiates a new Proxy controller.
     * @param webClientBuilder the web client builder
     */
    public ProxyController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Proxy server mono to call evsrest api.
     * @return the mono response entity
     */
    @GetMapping("/")
    public Mono<ResponseEntity<String>> proxyServer() {
        return webClient.get()
                .uri(evsRestApiUri)
                .retrieve()
                .toEntity(String.class);
    }
}
