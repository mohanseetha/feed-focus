package com.projs.FeedFocusBackend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@Document("Articles")
public class Article {
    @Id
    private String id;
    private String title;
    @Indexed(unique = true)
    private String url;
    private String source;
    private String publishedAt;
    private String content;
    private String topic;

    public Article(String title, String url, String source, String publishedAt, String summary, String topic) {
        this.title = title;
        this.url = url;
        this.source = source;
        this.publishedAt = publishedAt;
        this.content = summary;
        this.topic = topic;
    }
}