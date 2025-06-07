package com.projs.FeedFocusBackend.service;

import com.projs.FeedFocusBackend.model.Article;
import com.projs.FeedFocusBackend.repository.ArticleRepo;
import com.projs.FeedFocusBackend.util.RssParser;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

@Slf4j
@Service
public class ArticleService {
    private final ArticleRepo articleRepo;
    private final RssParser rssParser;
    private final ExecutorService fetchExecutor = Executors.newFixedThreadPool(10);

    public ArticleService(ArticleRepo articleRepo, RssParser rssParser) {
        this.articleRepo = articleRepo;
        this.rssParser = rssParser;
    }

    @Scheduled(fixedDelay = 1800000)
    public void scheduledFetch() {
        log.info("Starting scheduled fetch on thread {}", Thread.currentThread().getName());
        CompletableFuture.runAsync(this::fetchAndSaveArticlesFromRss, fetchExecutor)
                .thenRun(() -> log.info("Scheduled fetch finished"));
    }

    @Scheduled(cron = "0 0 2 ? * SUN")
    public void scheduledDelete() {
        deleteWeeklyArticles();
    }

    public void fetchAndSaveArticlesFromRss() {
        try {
            List<RssParser.Article> fetched = rssParser.fetchMultipleFeeds();

            Set<String> fetchedTitles = new HashSet<>();
            Set<String> fetchedUrls = new HashSet<>();
            for (RssParser.Article a : fetched) {
                fetchedTitles.add(a.title);
                fetchedUrls.add(a.url);
            }

            List<Article> existingArticles = articleRepo.findByTitleInOrUrlIn(fetchedTitles, fetchedUrls);

            Set<String> existingTitles = new HashSet<>();
            Set<String> existingUrls = new HashSet<>();
            for (Article a : existingArticles) {
                existingTitles.add(a.getTitle());
                existingUrls.add(a.getUrl());
            }

            List<Article> newArticles = new ArrayList<>();
            for (RssParser.Article rssArticle : fetched) {
                if (!existingTitles.contains(rssArticle.title) && !existingUrls.contains(rssArticle.url)) {
                    Article article = new Article(
                            rssArticle.title,
                            rssArticle.url,
                            rssArticle.source,
                            rssArticle.publishedAt,
                            rssArticle.summary,
                            rssArticle.topic
                    );
                    newArticles.add(article);
                }
            }
            if (!newArticles.isEmpty()) {
                articleRepo.saveAll(newArticles);
                log.info("Saved {} new articles", newArticles.size());
                cleanUpIfExceedsLimit();
            } else {
                log.info("No new articles to save");
            }
        } catch (Exception e) {
            log.error("Error during fetchAndSaveArticlesFromRss: {}", e.getMessage(), e);
        }
    }


    public void cleanUpIfExceedsLimit() {
        long totalCount = articleRepo.count();
        if (totalCount > 30000) {
            List<Article> latest10k = articleRepo.findTop10000ByOrderByPublishedAtDesc();
            if (!latest10k.isEmpty()) {
                String cutoff = latest10k.get(latest10k.size() - 1).getPublishedAt();
                articleRepo.deleteByPublishedAtLessThan(cutoff);
                log.info("Cleaned up articles: kept latest 10,000 articles");
            }
        }
    }

    public void deleteWeeklyArticles() {
        try {
            articleRepo.deleteByPublishedAtBefore(LocalDateTime.now().minusWeeks(1));
            log.info("Weekly Clean Successful");
        } catch (Exception e) {
            log.error("Error during weekly delete: {}", e.getMessage(), e);
        }
    }

    public Article getArticleById(String id) {
        return articleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Article doesn't exist"));
    }

    public List<Article> getAllArticles() {
        return articleRepo.findAllByOrderByPublishedAtDesc();
    }

    public List<Article> getArticlesByTopic(String topic) {
        return articleRepo.findByTopicIgnoreCaseOrderByPublishedAtDesc(topic);
    }

    @PreDestroy
    public void shutdownExecutor() {
        fetchExecutor.shutdown();
    }
}
