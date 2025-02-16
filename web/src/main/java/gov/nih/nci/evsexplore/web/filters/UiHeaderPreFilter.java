/*
 * Copyright 2020 West Coast Informatics - All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of West Coast Informatics
 * The intellectual and technical concepts contained herein are proprietary to
 * West Coast Informatics and may be covered by U.S. and Foreign Patents, patents in process,
 * and are protected by trade secret or copyright law.  Dissemination of this information
 * or reproduction of this material is strictly forbidden.
 */
package gov.nih.nci.evsexplore.web.filters;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import gov.nih.nci.evsexplore.web.properties.WebProperties;
// import gov.nih.nci.evsexplore.web.configuration.PropertiesConfiguration;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

/** Class to add a header prefilter to the UI. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class UiHeaderPreFilter implements Filter {

  /** The logger. */
  @SuppressWarnings("unused")
  private static final Logger logger = LoggerFactory.getLogger(UiHeaderPreFilter.class);

  /** The web properties. */
  @Autowired WebProperties properties;

  /** The header name. */
  private String headerName = "X-EVSRESTAPI-License-Key";

  /**
   * Filter the request to add a prefilter for our license.
   *
   * @param request the request
   * @param response the response
   * @param chain the chain
   * @throws IOException Signals that an I/O exception has occurred.
   * @throws ServletException the servlet exception
   */
  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest httpServletRequest = (HttpServletRequest) request;
    MutableHttpServletRequest mutableRequest = new MutableHttpServletRequest(httpServletRequest);
    mutableRequest.putHeader(headerName, properties.getUiLicense());

    chain.doFilter(mutableRequest, response);
  }

  /**
   * MutableHttpServletRequest class that allows the addition and modification of headers for a
   * request. This is useful when you want to add custom headers to a request.
   */
  static class MutableHttpServletRequest extends HttpServletRequestWrapper {
    /** The custom headers. */
    private final Map<String, String> customHeaders;

    /**
     * Instantiates a new mutable http servlet request.
     *
     * @param request the request
     */
    public MutableHttpServletRequest(HttpServletRequest request) {
      super(request);
      this.customHeaders = new HashMap<String, String>();
    }

    /**
     * Put header in the servlet request.
     *
     * @param name header name
     * @param value header value
     */
    public void putHeader(String name, String value) {
      this.customHeaders.put(name, value);
    }

    /**
     * Get header names.
     *
     * @return Enumeration of header names
     */
    @Override
    public Enumeration<String> getHeaderNames() {
      // create a set of the custom header names
      Set<String> set = new HashSet<String>(customHeaders.keySet());

      // now add the headers from the wrapped request object
      Enumeration<String> e = ((HttpServletRequest) getRequest()).getHeaderNames();
      while (e.hasMoreElements()) {
        // add the names of the request headers into the list
        String n = e.nextElement();
        set.add(n);
      }

      // create an enumeration from the set and return
      return Collections.enumeration(set);
    }

    /**
     * Get header value.
     *
     * @param name a <code>String</code> specifying the header name
     * @return a <code>String</code> containing the value of the requested
     */
    @Override
    public String getHeader(String name) {
      // check the custom headers first
      String value = this.customHeaders.get(name);

      if (value != null) {
        // if we found a custom header return it
        return value;
      }
      // else return the value from the wrapped request object
      return ((HttpServletRequest) getRequest()).getHeader(name);
    }
  }
}
