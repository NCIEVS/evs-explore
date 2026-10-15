package gov.nih.nci.evsexplore.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.sun.net.httpserver.HttpServer;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.zip.GZIPInputStream;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {"server.servlet.context-path=/test-explore",
        "gov.nih.nci.evsexplore.web.ui-license=test-license"})
class WebApplicationTest {
  private static final LinkedBlockingQueue<ForwardedRequest> REQUESTS = new LinkedBlockingQueue<>();
  private static final HttpServer DOWNSTREAM = startDownstream();

  private final HttpClient client = HttpClient.newHttpClient();

  @Autowired private Environment environment;

  record ForwardedRequest(String method, String uri, String body, String license, String header) {}

  private static HttpServer startDownstream() {
    try {
      HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
      server.createContext("/api/v1/", exchange -> {
        REQUESTS.add(new ForwardedRequest(exchange.getRequestMethod(),
            exchange.getRequestURI().toASCIIString(),
            new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8),
            exchange.getRequestHeaders().getFirst("X-EVSRESTAPI-License-Key"),
            exchange.getRequestHeaders().getFirst("X-Test-Header")));
        boolean error = exchange.getRequestURI().getPath().endsWith("/missing");
        byte[] body = (error ? "{\"error\":\"missing\"}" : "{\"result\":\"ok\"}")
            .getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(error ? 404 : 201, body.length);
        try (var output = exchange.getResponseBody()) {
          output.write(body);
        }
      });
      server.start();
      return server;
    } catch (IOException exception) {
      throw new IllegalStateException("Could not start the downstream test server", exception);
    }
  }

  @DynamicPropertySource
  static void downstreamProperties(DynamicPropertyRegistry registry) {
    registry.add("gov.nih.nci.evsexplore.web.evs-apibase-path",
        () -> "http://127.0.0.1:" + DOWNSTREAM.getAddress().getPort());
  }

  @AfterAll
  static void stopDownstream() {
    DOWNSTREAM.stop(0);
  }

  private HttpRequest.Builder request(String path) {
    return HttpRequest.newBuilder(URI.create("http://127.0.0.1:"
        + environment.getProperty("local.server.port") + "/test-explore" + path))
        .timeout(Duration.ofSeconds(10));
  }

  @Test
  void versionIsJson() throws Exception {
    var response = client.send(request("/version").GET().build(), HttpResponse.BodyHandlers.ofString());
    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.headers().firstValue("content-type").orElse("")).contains("application/json");
    assertThat(response.body()).contains("NCI EVS Explore API", "\"version\"");
  }

  @ParameterizedTest
  @ValueSource(strings = {"/welcome", "/search/ncit", "/concept/ncit/C123.4"})
  void angularDeepLinksServeIndex(String path) throws Exception {
    var index = client.send(request("/index.html").GET().build(), HttpResponse.BodyHandlers.ofString());
    var response = client.send(request(path).GET().build(), HttpResponse.BodyHandlers.ofString());
    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.body()).isEqualTo(index.body()).contains("<app-root");
  }

  @ParameterizedTest
  @ValueSource(strings = {"/assets/images/nci.png", "/assets/downloads/NCIT_Multi_Term_Request.xls"})
  void staticAssetsKeepCachePolicy(String path) throws Exception {
    var response = client.send(request(path).GET().build(), HttpResponse.BodyHandlers.ofByteArray());
    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.body()).isNotEmpty();
    assertThat(response.headers().firstValue("cache-control").orElse("")).contains("max-age=30");
  }

  @Test
  void largeStaticResponsesAreCompressed() throws Exception {
    var response = client.send(request("/index.html").header("Accept-Encoding", "gzip")
        .GET().build(), HttpResponse.BodyHandlers.ofByteArray());
    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.headers().firstValue("content-encoding").orElse("")).isEqualTo("gzip");
    try (var gzip = new GZIPInputStream(new ByteArrayInputStream(response.body()))) {
      assertThat(new String(gzip.readAllBytes(), StandardCharsets.UTF_8)).contains("<app-root");
    }
  }

  @Test
  void proxyPreservesRequestAndNormalizesSuccessStatus() throws Exception {
    REQUESTS.clear();
    String path = "/api/v1/concept/ncit/C123?term=a%20b%2Bc&include=summary";
    var response = client.send(request(path).header("Content-Type", "application/json")
        .header("X-Test-Header", "preserved")
        .POST(HttpRequest.BodyPublishers.ofString("{\"value\":\"test\"}"))
        .build(), HttpResponse.BodyHandlers.ofString());
    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.body()).isEqualTo("{\"result\":\"ok\"}");
    assertThat(REQUESTS.poll(5, TimeUnit.SECONDS)).isEqualTo(new ForwardedRequest(
        "POST", path, "{\"value\":\"test\"}", "test-license", "preserved"));
  }

  @Test
  void downstreamErrorsKeepStatusAndBody() throws Exception {
    var response = client.send(request("/api/v1/missing").GET().build(), HttpResponse.BodyHandlers.ofString());
    assertThat(response.statusCode()).isEqualTo(404);
    assertThat(response.body()).isEqualTo("{\"error\":\"missing\"}");
  }
}
