package ca.fryingfan.wiki;

import ca.fryingfan.wiki.model.WikiSearchResult;
import ca.fryingfan.wiki.model.WikiSearchStats;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.core.CountRequest;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;

@Service
public class SearchService {

    private static final String INDEX = "wiki";

    private final RestHighLevelClient client;

    public SearchService(RestHighLevelClient client) {
        this.client = client;
    }

    public List<WikiSearchResult> search(String term) throws IOException {
        final SearchSourceBuilder builder = new SearchSourceBuilder();
        builder.query(
                multiMatchQuery(term)
                        .field("title", 2.0F)
                        .field("body", 1.0F)
        );
        builder.size(50);

        final SearchRequest request = new SearchRequest(INDEX).source(builder);

        return Stream.of(client.search(request, RequestOptions.DEFAULT).getHits().getHits())
                .map(hit -> {
                    final String title = String.valueOf(hit.getSourceAsMap().get("title"));
                    final String url = "https://en.wikipedia.org/wiki/" + URLEncoder.encode(title, StandardCharsets.UTF_8).replace("+", "_");
                    final String body = String.valueOf(hit.getSourceAsMap().get("body"));
                    final String excerpt = body
                            .substring(0, Math.min(100, body.length()))
                            .replace("(", "")
                            .replace(")", "")
                            .replace(",", "")
                            .replace(";", "")
                            .replace("thumb|right", "")
                            .replace("|", "");
                    return new WikiSearchResult(title, url, hit.getScore(), excerpt);
                })
                .collect(Collectors.toList());
    }

    private long countRecords() throws IOException {
        final CountRequest request = new CountRequest(INDEX);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        request.source(searchSourceBuilder);

        return client.count(request, RequestOptions.DEFAULT).getCount();
    }

    public WikiSearchStats getStats() throws IOException {
        return new WikiSearchStats(countRecords());
    }
}
