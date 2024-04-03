package gov.nih.nci.evsexplore.web.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Enumeration;
import java.util.logging.Level;

@Service
public class ProxyService {
    private static final Logger logger = LoggerFactory.getLogger(ProxyService.class);

    @Value("${spring.cloud.gateway.routes[0].uri}")
    private String domain;

    public ResponseEntity<String> processProxyRequest(
            String body,
            HttpMethod method,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String requestUrl = request.getServletPath();
        logger.info("REQUEST PATH: " + requestUrl);

        // replacing context path form urI to match actual gateway URI
        URI uri = UriComponentsBuilder.fromUriString(domain)
                .path(requestUrl)
                .query(request.getQueryString())
                .build(true).toUri();

        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();

        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.set(headerName, request.getHeader(headerName));
        }

        HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);
        ClientHttpRequestFactory factory = new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory());
        RestTemplate restTemplate = new RestTemplate(factory);

        try {
            ResponseEntity<String> serverResponse = restTemplate.exchange(uri, method, httpEntity, String.class);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.put(HttpHeaders.CONTENT_TYPE, serverResponse.getHeaders().get(HttpHeaders.CONTENT_TYPE));
            logger.info(serverResponse.toString());
            return serverResponse;
        } catch (HttpStatusCodeException e) {
            logger.warn("Error in processing request: ", e);
            return ResponseEntity.status(e.getStatusCode())
                    .headers(e.getResponseHeaders())
                    .body(e.getResponseBodyAsString());
        }
    }
}
