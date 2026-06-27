package com.shubham.portfolio.service;

import com.shubham.portfolio.dto.ContactRequestDTO;
import com.shubham.portfolio.dto.ContactResponseDTO;
import com.shubham.portfolio.model.ContactMessage;
import com.shubham.portfolio.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {

    private static final String RECIPIENT_EMAIL = "shubhamkalwar14@gmail.com";

    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender mailSender;

    public ContactResponseDTO handleContact(ContactRequestDTO dto) {
        // 1. Persist to DB
        ContactMessage saved = contactMessageRepository.save(
                ContactMessage.builder()
                        .name(dto.getName())
                        .email(dto.getEmail())
                        .message(dto.getMessage())
                        .build()
        );
        log.info("ContactService: saved message id={} from={}", saved.getId(), dto.getEmail());

        // 2. Send email — failure must NOT propagate to the caller
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(RECIPIENT_EMAIL);
            mail.setSubject("New Portfolio Contact from " + dto.getName());
            mail.setText(
                    "You received a new contact message:\n\n" +
                    "Name   : " + dto.getName() + "\n" +
                    "Email  : " + dto.getEmail() + "\n\n" +
                    "Message:\n" + dto.getMessage()
            );
            mailSender.send(mail);
            log.info("ContactService: notification email sent for message id={}", saved.getId());
        } catch (Exception ex) {
            log.warn("ContactService: email send failed for message id={} — {}", saved.getId(), ex.getMessage());
        }

        return new ContactResponseDTO(true, "Your message has been received. I'll get back to you soon!");
    }
}
