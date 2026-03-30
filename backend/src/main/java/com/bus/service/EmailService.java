package com.bus.service;

import com.bus.entity.Booking;
import com.bus.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PdfService pdfService;

    public void sendOtpEmail(String email, String otp, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("Your OTP for Login - Bus Reservation");

            String emailContent = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;'>" +
                "<h2 style='color: #6366f1; text-align: center;'>Bus Reservation System</h2>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<p>Your OTP for login is:</p>" +
                "<div style='background: linear-gradient(135deg, #6366f1 0%%, #8b5cf6 100%%); color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; border-radius: 8px; letter-spacing: 5px;'>%s</div>" +
                "<p style='color: #666; font-size: 14px;'>This OTP is valid for 5 minutes only.</p>" +
                "<p style='color: #999; font-size: 12px;'>If you did not request this OTP, please ignore this email.</p>" +
                "<hr style='border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;'>" +
                "<p style='color: #999; font-size: 12px; text-align: center;'>Bus Reservation System &copy; 2024</p>" +
                "</div>",
                name, otp
            );

            helper.setText(emailContent, true);

            mailSender.send(message);
            System.out.println("OTP email sent successfully to: " + email);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to send OTP email: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email");
        }
    }

    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Bus Ticket Confirmation - Booking #" + booking.getId());

            String passengerName = booking.getPassengerName() != null && !booking.getPassengerName().trim().isEmpty()
                    ? booking.getPassengerName().trim()
                    : booking.getUser().getName();
            String passengerAge = booking.getPassengerAge() == null ? "N/A" : String.valueOf(booking.getPassengerAge());
            String passengerGender = booking.getPassengerGender() == null || booking.getPassengerGender().trim().isEmpty()
                    ? "N/A"
                    : booking.getPassengerGender().trim();
            String passengerPhone = booking.getPassengerPhone() == null || booking.getPassengerPhone().trim().isEmpty()
                    ? "N/A"
                    : booking.getPassengerPhone().trim();
            String travelDate = booking.getTravelDate() == null || booking.getTravelDate().trim().isEmpty()
                    ? booking.getBus().getTravelDate()
                    : booking.getTravelDate().trim();

            String emailContent = String.format(
                "Dear %s,\n\nYour booking has been confirmed!\n\n" +
                "Booking Details:\n" +
                "Booking ID: %d\n" +
                "Passenger: %s\n" +
                "Age/Gender: %s / %s\n" +
                "Passenger Phone: %s\n" +
                "Bus: %s\n" +
                "From: %s To: %s\n" +
                "Seat Number: %s\n" +
                "Amount Paid: Rs. %.2f\n" +
                "Travel Date: %s\n\n" +
                "Thank you for choosing our service!\n\nBest Regards,\nBus Reserve Team",
                passengerName,
                booking.getId(),
                passengerName,
                passengerAge,
                passengerGender,
                passengerPhone,
                booking.getBus().getBusName(),
                booking.getBus().getFromCity(),
                booking.getBus().getToCity(),
                booking.getSeatNumber(),
                booking.getAmount(),
                travelDate
            );

            helper.setText(emailContent);

            try {
                byte[] pdf = pdfService.generateTicket(booking);
                helper.addAttachment("BusTicket.pdf",
                    () -> new java.io.ByteArrayInputStream(pdf));
            } catch (Exception e) {
                System.out.println("Could not generate PDF: " + e.getMessage());
            }

            mailSender.send(message);
            System.out.println("Email sent successfully to: " + booking.getUser().getEmail());

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendPaymentFailedEmail(User user, String utrNumber, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(user.getEmail());
            helper.setSubject("Payment Failed - Booking Request");

            String safeUtr = (utrNumber == null || utrNumber.trim().isEmpty()) ? "N/A" : utrNumber.trim();
            String safeReason = (reason == null || reason.trim().isEmpty()) ? "Payment verification failed" : reason.trim();

            String content = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;'>" +
                "<h2 style='color: #b91c1c; margin-bottom: 12px;'>Payment Failed</h2>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<p>Your booking payment could not be confirmed.</p>" +
                "<p><strong>UTR:</strong> %s</p>" +
                "<p><strong>Reason:</strong> %s</p>" +
                "<p>You can retry booking from the app.</p>" +
                "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 18px 0;'>" +
                "<p style='font-size: 12px; color: #6b7280;'>Bus Reservation System</p>" +
                "</div>",
                user.getName(), safeUtr, safeReason
            );

            helper.setText(content, true);
            mailSender.send(message);
            System.out.println("Payment failure email sent to: " + user.getEmail());
        } catch (Exception e) {
            System.out.println("Failed to send payment failure email: " + e.getMessage());
        }
    }
}
