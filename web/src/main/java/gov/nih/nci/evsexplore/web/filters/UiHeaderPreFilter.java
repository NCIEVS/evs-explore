package gov.nih.nci.evsexplore.web.filters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import gov.nih.nci.evsexplore.web.properties.WebProperties;

@Component
public class UiHeaderPreFilter implements GlobalFilter, Ordered {

  /** The web properties. */
  @Autowired
  WebProperties properties;

  /**
   * Gets the order to execute the filter in the chain.
   * @return the order
   */
  @Override
  public int getOrder() {
    // Pre-filter value
    return -1;
  }

  /**
   * Filter the request.
   * @param exchange the current server exchange
   * @param chain provides a way to delegate to the next filter
   * @return the response
   */
  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    ServerHttpRequest request = exchange.getRequest().mutate()
            .header("X-EVSRESTAPI-License-Key", properties.getUiLicense())
            .build();

    return chain.filter(exchange.mutate().request(request).build());
  }
}
