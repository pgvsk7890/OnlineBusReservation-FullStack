package com.bus.controller;

import com.bus.entity.Booking;
import com.bus.service.BookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private BookingService bookingService;

    // Get all pending bookings
    @GetMapping("/pendingBookings")
    public List<Booking> getPendingBookings() {

        return bookingService.getPendingBookings();

    }

    // Approve booking
    @PutMapping("/approve/{bookingId}")
    public Booking approveBooking(@PathVariable Long bookingId) {

        return bookingService.approveBooking(bookingId);

    }

    // Reject booking
    @PutMapping("/reject/{bookingId}")
    public Booking rejectBooking(@PathVariable Long bookingId) {

        return bookingService.rejectBooking(bookingId);

    }

}