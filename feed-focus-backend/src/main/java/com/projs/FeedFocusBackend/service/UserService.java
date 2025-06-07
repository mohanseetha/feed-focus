package com.projs.FeedFocusBackend.service;

import com.projs.FeedFocusBackend.model.Article;
import com.projs.FeedFocusBackend.model.User;
import com.projs.FeedFocusBackend.repository.ArticleRepo;
import com.projs.FeedFocusBackend.repository.UserRepo;
import com.projs.FeedFocusBackend.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepo userRepo;
    private final ArticleRepo articleRepo;
    private final JwtUtil jwtUtil;

    public UserService(UserRepo userRepo, ArticleRepo articleRepo, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.articleRepo = articleRepo;
        this.jwtUtil = jwtUtil;
    }

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public void registerUser(String username, String email, String password, List<String> preferences) {
        if (userRepo.existsByUsername(username) || userRepo.existsByEmail(email))
           throw new RuntimeException("Username or email already exists");

        if (preferences.size() < 5)
            throw new RuntimeException("Preferences should be more than 5");

        String hashedPass = encoder.encode(password);
        User user = new User(username, email, hashedPass, preferences);
        userRepo.save(user);
    }

    public Map<String, String> loginUser(String username, String password) {
        User user = userRepo.findByUsername(username);
        if (user != null && encoder.matches(password, user.getPassword())) {
            String token = jwtUtil.generateToken(username);
            Map<String, String> result = new HashMap<>();
            result.put("token", token);
            result.put("user", user.getUsername());
            return result;
        } else {
            throw new RuntimeException("Username or Password is Incorrect");
        }
    }

    public void updatePreference(String username, List<String> preferences) {
        User user = userRepo.findByUsername(username);
        if (user != null && preferences != null) {
            if (preferences.size() >= 5) {
                List<String> normalizedPrefs = preferences.stream()
                        .filter(Objects::nonNull)
                        .map(String::toLowerCase)
                        .distinct()
                        .collect(Collectors.toList());

                user.setPreferences(normalizedPrefs);
                userRepo.save(user);
            } else {
                throw new RuntimeException("Preferences should be more than 5");
            }
        } else {
            throw new RuntimeException("User not found or preferences are null");
        }
    }

    public void addBookmark(String username, Article article) {
        User user = userRepo.findByUsername(username);
        if (user != null && articleRepo.existsByUrl(article.getUrl())) {
            if (!user.getBookmarks().contains(article)) {
                user.getBookmarks().add(article);
                userRepo.save(user);
            }
        } else {
            throw new RuntimeException("User not found or article does not exist");
        }
    }

    public void removeBookmark(String username, Article article) {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User doesn't exists");
        }
        if (!user.getBookmarks().contains(article)) {
            throw new RuntimeException("No Bookmarks");
        }
        user.getBookmarks().remove(article);
        userRepo.save(user);

    }

    public User getUserByUsername(String username) {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User doesn't exists");
        }
        return user;
    }

    public List<Article> getUserPreferredArticles(String username) {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User doesn't exist");
        }
        if (user.getPreferences() == null || user.getPreferences().isEmpty()) {
            throw new RuntimeException("No Preferences for User");
        }
        Set<Article> articles = new LinkedHashSet<>();
        for (String preference : user.getPreferences()) {
            articles.addAll(articleRepo.findByTopicIgnoreCaseOrderByPublishedAtDesc(preference));
        }
        return new ArrayList<>(articles);
    }

}
