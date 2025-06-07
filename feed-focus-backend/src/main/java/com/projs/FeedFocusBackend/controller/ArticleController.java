package com.projs.FeedFocusBackend.controller;

import com.projs.FeedFocusBackend.model.Article;
import com.projs.FeedFocusBackend.service.ArticleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public ResponseEntity<List<Article>> getArticles(
            @RequestParam(required = false) String topic
    ) {
        try {
            List<Article> articles;
            if (topic != null) {
                articles = articleService.getArticlesByTopic(topic);
            } else {
                articles = articleService.getAllArticles();
            }
            return ResponseEntity.status(HttpStatus.OK).body(articles);
        } catch (Exception e) {
            log.error("Error fetching articles: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable String id) {
        try {
            Article article = articleService.getArticleById(id);
            return ResponseEntity.status(HttpStatus.OK).body(article);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
