package gov.nih.nci.evsexplore.web.controllers;

import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

/**
 * The controller for sending proxy request to the EVS REST API.
 * 
 */
@RestController
public class EVSController {
  /**
   * The logger.
   */
  Logger logger = Logger.getLogger(EVSController.class.getName());

  /**
   * The proxy service.
   */
  @Autowired
  ProxyService service;


  /**
   * Send our request to the EVS REST API.
   * 
   * @param body The body of the request.
   * @param method The method of the request.
   * @param request The request.
   * @return The response entity.
   */
  @RequestMapping("api/v1/**")
  public ResponseEntity<String> sendRequestToEVSRestApi(@RequestBody(required = false) String body,
    HttpMethod method, HttpServletRequest request) {
    try {
      // Send the request to the proxy service
      final ResponseEntity<String> result =
          service.processProxyRequest(body, method, request);
      return result;

    } catch (Exception e) {
      e.printStackTrace();
      logger.severe("Unexpected error sending proxy request");
      throw e;
    }
  }
}
