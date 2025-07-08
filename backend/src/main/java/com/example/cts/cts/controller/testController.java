package com.example.cts.cts.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/cts")
public class testController {

    @GetMapping("/test")
    public String testEndpoint() {
        return "Test endpoint is working!";
    }
}
