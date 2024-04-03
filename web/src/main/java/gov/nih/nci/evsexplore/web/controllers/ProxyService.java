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
import java.util.Objects;
import java.util.logging.Level;

/**
 * Proxy Service for handling the requests to the EVS REST API.
 */
@Service
public class ProxyService {
    /**
     * The logger.
     */
    private static final Logger logger = LoggerFactory.getLogger(ProxyService.class);

    /**
     * The domain uri, pulled from our application.yml.
     */
    @Value("${gov.nih.nci.evsexplore.web.evsApibasePath}")
    private String domain;

    /**
     * Proocess the proxy request and handle the various components we
     * need to send with the request to the EVS REST API.
     * @param body The body of the request.
     * @param method The method of the request.
     * @param request The request.
     * @param response  The response.
     * @return  The response entity.
     */
    public ResponseEntity<String> processProxyRequest(
            String body,
            HttpMethod method,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        // Get the request URL
        String requestUrl = request.getServletPath();
        logger.info("REQUEST PATH: " + requestUrl);

        // replacing context path from urI to match actual gateway URI
        URI uri = UriComponentsBuilder.fromUriString(domain)
                .path(requestUrl)
                .query(request.getQueryString())
                .build(true).toUri();

        // Create the headers for the request
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();

        //  Add the headers to the request
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.set(headerName, request.getHeader(headerName));
        }

        // Create the request entity
        HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);
        ClientHttpRequestFactory factory = new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory());
        RestTemplate restTemplate = new RestTemplate(factory);

        // Send the request to the EVS REST API
        try {
            ResponseEntity<String> serverResponse = restTemplate.exchange(uri, method, httpEntity,
                   String.class);
            logger.info("Server response = " + serverResponse);
            return serverResponse;
        } catch (HttpStatusCodeException e) {
            logger.warn("Error in processing request: ", e);
            return ResponseEntity.status(e.getStatusCode())
                    .headers(e.getResponseHeaders())
                    .body(e.getResponseBodyAsString());
        }
    }
}
