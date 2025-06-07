package com.projs.FeedFocusBackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class EntryController {
    @GetMapping("/")
    public String ping() {
        return "Hello There";
    }
}
