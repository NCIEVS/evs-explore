package gov.nih.nci.evsexplore.web.filters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.stereotype.Component;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

import gov.nih.nci.evsexplore.web.properties.WebProperties;

@Component
public class UiHeaderPreFilter extends ZuulFilter {

  /** The web properties. */
  @Autowired
  WebProperties properties;

  @Override
  public int filterOrder() {
    return FilterConstants.PRE_DECORATION_FILTER_ORDER - 1;
  }

  @Override
  public String filterType() {
    return FilterConstants.PRE_TYPE;
  }

  @Override
  public boolean shouldFilter() {
    return true;
  }

  @Override
  public Object run() {
    final RequestContext ctx = RequestContext.getCurrentContext();
    ctx.addZuulRequestHeader("X-EVSRESTAPI-License-Key", properties.getUiLicense());

    return null;
  }
}
