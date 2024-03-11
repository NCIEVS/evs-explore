package gov.nih.nci.evsexplore.web.filters;

import gov.nih.nci.evsexplore.web.properties.WebProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class UiHeaderPreFilter implements GlobalFilter, Ordered {

    /** The web properties. */
    @Autowired
    WebProperties properties;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        exchange.getRequest().mutate().header("X-EVSRESTAPI-License-Key", properties.getUiLicense()).build();
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;  // the order is before the PreDecoration filter
    }
}
