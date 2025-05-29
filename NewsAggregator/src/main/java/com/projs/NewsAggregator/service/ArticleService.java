package com.projs.NewsAggregator.service;

import com.projs.NewsAggregator.model.Article;
import com.projs.NewsAggregator.repository.ArticleRepo;
import com.projs.NewsAggregator.util.RssParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ArticleService {
    private final ArticleRepo articleRepo;
    private final RssParser rssParser;

    public ArticleService(ArticleRepo articleRepo, RssParser rssParser) {
        this.articleRepo = articleRepo;
        this.rssParser = rssParser;
    }

    @Scheduled(fixedDelay = 1800000) //  30 mins
    public void scheduledFetch() {
        fetchAndSaveArticlesFromRss();
    }

    public void fetchAndSaveArticlesFromRss() {
        List<RssParser.Article> fetched = rssParser.fetchMultipleFeeds();
        for (RssParser.Article rssArticle : fetched) {
            if (!articleRepo.existsByUrl(rssArticle.url)) {
                Article article = new Article(
                        rssArticle.title,
                        rssArticle.url,
                        rssArticle.source,
                        rssArticle.publishedAt,
                        rssArticle.summary,
                        rssArticle.topic
                );
                articleRepo.save(article);
            }
        }
        log.info("Successfully fetched feeds");
    }

    public Article getArticleById(String id) {
        Optional<Article> articleOpt = articleRepo.findById(id);
        Article article = articleOpt.orElse(null);
        if (article == null) {
            throw new RuntimeException("Article doesn't exist");
        }
        return article;
    }

    public List<Article> getAllArticles() {
        return articleRepo.findAllByOrderByPublishedAtDesc();
    }

    public List<Article> getArticlesByTopic(String topic) {
        return articleRepo.findByTopicIgnoreCaseOrderByPublishedAtDesc(topic);
    }
}
