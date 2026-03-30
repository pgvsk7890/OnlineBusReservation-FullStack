package com.bus.controller;

import com.bus.dto.CreateBookingRequest;
import com.bus.entity.Seat;
import com.bus.entity.Booking;
import com.bus.repository.BookingRepository;
import com.bus.service.BookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;


    // Lock single seat
    @PostMapping("/lock/{seatId}")
    public ResponseEntity<?> lockSeat(@PathVariable Long seatId) {

        try {

            Seat seat = bookingService.lockSeat(seatId);

            return ResponseEntity.ok(seat);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }


    // Lock multiple seats
    @PostMapping("/lockSeats")
    public ResponseEntity<?> lockSeats(@RequestBody List<Long> seatIds) {

        try {

            List<Seat> seats = bookingService.lockSeats(seatIds);

            return ResponseEntity.ok(seats);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }


    // Create booking after payment
    @PostMapping("/createBooking")
    public ResponseEntity<?> createBooking(
            @RequestBody CreateBookingRequest request
    ) {

        try {

            List<Booking> bookings = bookingService.createBookings(
                    request.getSeatIds(),
                    request.getUserId(),
                    request.getUtrNumber(),
                    request.getTravelDate(),
                    request.getCouponCode(),
                    request.getPassengers()
            );

            return ResponseEntity.ok(bookings);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }


    // ADMIN - get all bookings
    @GetMapping("/all")
    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }


    // USER - get bookings by user
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId){
        return bookingRepository.findByUserId(userId);
    }

}
