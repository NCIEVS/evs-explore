package gov.nih.nci.evsexplore.web.controllers;

import java.net.URI;
import java.util.Enumeration;

import gov.nih.nci.evsexplore.web.properties.WebProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Proxy Service for handling the requests to the EVS REST API.
 */
@Service
public class ProxyService {
  /**
   * The logger.
   */
  private static final Logger logger = LoggerFactory.getLogger(ProxyService.class);

  /** The web properties. */
  @Autowired
  WebProperties properties;

  /**
   * Process the proxy request and handle the various components we need to send with the request
   * to the EVS REST API.
   *
   * @param body The body of the request.
   * @param method The method of the request.
   * @param request The request.
   * @return The response entity.
   */
  public ResponseEntity<String> processProxyRequest(final String body, final HttpMethod method,
    final HttpServletRequest request) {
    // Get the request URL
    String requestUrl = request.getServletPath();

    // replacing context path from URI to match actual gateway URI.
       URI uri = UriComponentsBuilder.fromUriString(
               properties.getEvsApibasePath())
               .path(requestUrl)
               .query(request.getQueryString())
               .build(true).toUri();

    // Create the headers for the request
    HttpHeaders headers = new HttpHeaders();
    Enumeration<String> headerNames = request.getHeaderNames();

    // Add the headers to the request
    while (headerNames.hasMoreElements()) {
      String headerName = headerNames.nextElement();
      headers.set(headerName, request.getHeader(headerName));
    }

    // Create the request entity
    HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);
    ClientHttpRequestFactory factory =
        new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory());
    RestTemplate restTemplate = new RestTemplate(factory);

    // Send the request to the EVS REST API. Make sure we are always using new HttpHeaders,
    // otherwise you will hit a 502 Gateway Error on Dev/Prod env.
    try {
      ResponseEntity<String> serverResponse =
          restTemplate.exchange(uri, method, httpEntity, String.class);

      return new ResponseEntity<>(serverResponse.getBody(), new HttpHeaders(), HttpStatus.OK);

    } catch (HttpStatusCodeException e) {
      logger.error("Error in processing request: ", e);
      return ResponseEntity.status(e.getStatusCode()).headers(new HttpHeaders())
          .body(e.getResponseBodyAsString());
    }
  }
}
