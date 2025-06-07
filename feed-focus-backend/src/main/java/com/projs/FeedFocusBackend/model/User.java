package com.projs.FeedFocusBackend.model;

import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Data
@Document("Users")
public class User {
    @Id
    private String id;
    @Indexed(unique = true)
    private String username;
    @Indexed(unique = true)
    @Email(message = "Enter valid email")
    private String email;
    private String password;
    private List<String> preferences;
    private List<Article> bookmarks;

    public User(String username, String email, String password, List<String> preferences) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.preferences = preferences;
        this.bookmarks = new ArrayList<>();
    }
}
