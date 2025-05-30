package com.projs.NewsAggregator.repository;

import com.projs.NewsAggregator.model.Article;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ArticleRepo extends MongoRepository<Article, String> {
    boolean existsByUrl(String url);

    List<Article> findAllByOrderByPublishedAtDesc();

    List<Article> findByTopicIgnoreCaseOrderByPublishedAtDesc(String topic);

    void deleteByPublishedAtBefore(LocalDateTime cutoff);

    @Query(value = "{}", fields = "{url: 1, _id: 0}")
    List<String> findAllUrls();
    
    List<Article> findTop10000ByOrderByPublishedAtDesc();

    void deleteByPublishedAtLessThan(String cutoff);
}
