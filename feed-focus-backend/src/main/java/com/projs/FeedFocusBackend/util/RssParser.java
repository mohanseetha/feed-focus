package com.projs.FeedFocusBackend.util;

import com.projs.FeedFocusBackend.config.FeedConfig;
import com.rometools.rome.feed.synd.*;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Slf4j
@Component
public class RssParser {

    @AllArgsConstructor
    public static class Article {
        public String title;
        public String url;
        public String source;
        public String publishedAt;
        public String summary;
        public String topic;
    }

    private final FeedConfig feedConfig;
    private final ExecutorService executor = Executors.newFixedThreadPool(10);

    public RssParser(FeedConfig feedConfig) {
        this.feedConfig = feedConfig;
    }

    public List<Article> fetchArticlesFromFeed(String feedUrl, String topic) {
        List<Article> articles = new ArrayList<>();
        try {
            URL url = new URL(feedUrl);
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = input.build(new XmlReader(url));
            ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);
            for (SyndEntry entry : feed.getEntries()) {
                Date pubDate = entry.getPublishedDate();
                if (pubDate == null || pubDate.toInstant().isAfter(now.toInstant())) continue;
                String title = entry.getTitle();
                String link = entry.getLink();
                String source = feed.getTitle();
                String publishedAt = pubDate.toInstant().toString();
                String summary = entry.getDescription() != null
                        ? Jsoup.parse(entry.getDescription().getValue()).text()
                        : "";
                articles.add(new Article(title, link, source, publishedAt, summary, topic));
            }
            log.info("Parsed {} articles from feed {}", articles.size(), feedUrl);
        } catch (Exception e) {
            log.error("Failed to fetch or parse RSS feed: {} ({})", feedUrl, e.getMessage());
        }
        return articles;
    }

    public List<Article> fetchMultipleFeeds() {
        List<CompletableFuture<List<Article>>> futures = new ArrayList<>();
        for (Map.Entry<String, List<String>> entry : feedConfig.getFeeds().entrySet()) {
            String topic = entry.getKey();
            for (String feedUrl : entry.getValue()) {
                CompletableFuture<List<Article>> future = CompletableFuture.supplyAsync(() ->
                        fetchArticlesFromFeed(feedUrl.trim(), topic), executor
                ).exceptionally(ex -> {
                    log.error("Error fetching feed {}: {}", feedUrl, ex.getMessage());
                    return Collections.emptyList();
                });
                futures.add(future);
            }
        }
        return futures.stream()
                .map(CompletableFuture::join)
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }
}
