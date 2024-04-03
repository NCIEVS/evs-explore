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
@RestController
public class EVSController {
    Logger logger = Logger.getLogger(EVSController.class.getName());

    @Autowired
    ProxyService service;
    @RequestMapping("api/v1/**")
    public ResponseEntity<String> sendRequestToEVSRestApi(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        logger.info("Received request to send to EVS REST API");
        return service.processProxyRequest(body, method, request, response);
    }
}
