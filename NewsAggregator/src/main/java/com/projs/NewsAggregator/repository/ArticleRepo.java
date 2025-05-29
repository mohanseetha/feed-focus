package com.projs.NewsAggregator.repository;

import com.projs.NewsAggregator.model.Article;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ArticleRepo extends MongoRepository<Article, String> {
    boolean existsByUrl(String url);

    List<Article> findAllByOrderByPublishedAtDesc();

    List<Article> findByTopicIgnoreCaseOrderByPublishedAtDesc(String topic);
}
