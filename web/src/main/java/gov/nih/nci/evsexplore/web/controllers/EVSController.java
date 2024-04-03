package gov.nih.nci.evsexplore.web.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Logger;

/**
 * The controller for sending proxy request to the EVS REST API.

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
     * @param body  The body of the request.
     * @param method    The method of the request.
     * @param request   The request.
     * @param response  The response.
     * @return  The response entity.
     */
    @RequestMapping("api/v1/**")
    public ResponseEntity<byte[]> sendRequestToEVSRestApi(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        logger.info("Received request to send to EVS REST API");
        // Send the request to the proxy service
        return service.processProxyRequest(body, method, request, response);
    }
}
