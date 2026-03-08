package com.bus.service;

import com.bus.entity.Booking;
import com.bus.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private EmailService emailService;

    @Autowired
    private BookingRepository bookingRepository;

    public Booking approveBooking(Long id){

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentStatus("APPROVED");
        booking.setBookingStatus("SUCCESS");

        Booking saved = bookingRepository.save(booking);

        emailService.sendBookingConfirmation(saved);

        return saved;
    }


}
