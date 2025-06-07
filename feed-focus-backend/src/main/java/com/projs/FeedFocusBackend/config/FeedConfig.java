package com.projs.FeedFocusBackend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@Data
@ConfigurationProperties(prefix = "rss")
public class FeedConfig {
    private Map<String, List<String>> feeds = new HashMap<>();

    public List<String> getFeedsForTopic(String topic) {
        return feeds.getOrDefault(topic.toLowerCase(), List.of());
    }

}
