package com.kaushik.SmartStock.Controller;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final JavaMailSender mailSender;

    public TestController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @GetMapping("/test-mail")
    public String test() {
        return mailSender.toString();
    }
}