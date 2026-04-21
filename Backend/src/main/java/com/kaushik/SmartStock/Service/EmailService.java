package com.kaushik.SmartStock.Service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor

public class EmailService {
    
    private final JavaMailSender javaMailSender;

    public void sendEmails(String toEmail, String custName){

        String subject = "We Miss You at SmartStock!";
        
        String body = "Hi " + custName + ",\n\n"
                + "It’s been some time since your last visit.\n"
                + "Are you in need of any products?\n\n"
                + "You can directly reply to this email.\n\n"
                + "Regards,\n"
                + "SmartStock Team";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        javaMailSender.send(message);

    }
    

}
