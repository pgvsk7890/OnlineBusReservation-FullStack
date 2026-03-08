package com.bus.service;

import com.bus.dto.PassengerDetailRequest;
import com.bus.entity.Seat;
import com.bus.entity.Booking;
import com.bus.entity.Bus;
import com.bus.entity.User;

import com.bus.repository.SeatRepository;
import com.bus.repository.BookingRepository;
import com.bus.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public Seat lockSeat(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if ("LOCKED".equalsIgnoreCase(seat.getStatus()) && seat.getLockedAt() != null) {
            if (seat.getLockedAt().plusMinutes(7).isBefore(LocalDateTime.now())) {
                seat.setStatus("AVAILABLE");
                seat.setLockedAt(null);
            }
        }

        if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
            throw new RuntimeException("Seat not available");
        }

        seat.setStatus("LOCKED");
        seat.setLockedAt(LocalDateTime.now());

        return seatRepository.save(seat);
    }

    public List<Seat> lockSeats(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findAllById(seatIds);

        if (seats.isEmpty()) {
            throw new RuntimeException("Seats not found");
        }

        for (Seat seat : seats) {
            if ("LOCKED".equalsIgnoreCase(seat.getStatus()) && seat.getLockedAt() != null) {
                if (seat.getLockedAt().plusMinutes(7).isBefore(LocalDateTime.now())) {
                    seat.setStatus("AVAILABLE");
                    seat.setLockedAt(null);
                }
            }

            if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
                throw new RuntimeException("Seat " + seat.getSeatNumber() + " not available");
            }
        }

        for (Seat seat : seats) {
            seat.setStatus("LOCKED");
            seat.setLockedAt(LocalDateTime.now());
        }

        return seatRepository.saveAll(seats);
    }

    public List<Booking> createBookings(List<Long> seatIds, Long userId, String utrNumber, List<PassengerDetailRequest> passengers) {
        String normalizedUtr = utrNumber == null ? "" : utrNumber.trim().toUpperCase();
        if (normalizedUtr.isEmpty()) {
            throw new RuntimeException("UTR number is required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            if (seatIds == null || seatIds.isEmpty()) {
                throw new RuntimeException("No seats selected");
            }

            if (passengers == null || passengers.isEmpty()) {
                throw new RuntimeException("Passenger details are required");
            }

            Map<Long, PassengerDetailRequest> passengerBySeatId = new HashMap<>();
            for (PassengerDetailRequest passenger : passengers) {
                if (passenger == null || passenger.getSeatId() == null) {
                    throw new RuntimeException("Passenger seat mapping is invalid");
                }
                passengerBySeatId.put(passenger.getSeatId(), passenger);
            }

            List<Seat> fetchedSeats = seatRepository.findAllById(seatIds);
            Map<Long, Seat> seatById = new HashMap<>();
            for (Seat seat : fetchedSeats) {
                seatById.put(seat.getId(), seat);
            }

            List<Booking> bookings = new ArrayList<>();

            for (Long seatId : seatIds) {
                Seat seat = seatById.get(seatId);
                if (seat == null) {
                    throw new RuntimeException("Seat not found");
                }

                if (!"LOCKED".equalsIgnoreCase(seat.getStatus())) {
                    throw new RuntimeException("Seat must be locked before booking");
                }

                PassengerDetailRequest passenger = passengerBySeatId.get(seatId);
                if (passenger == null) {
                    throw new RuntimeException("Passenger details missing for seat " + seat.getSeatNumber());
                }

                String passengerName = passenger.getName() == null ? "" : passenger.getName().trim();
                String passengerGender = passenger.getGender() == null ? "" : passenger.getGender().trim().toUpperCase();
                String passengerPhone = passenger.getPhone() == null ? "" : passenger.getPhone().trim();
                Integer passengerAge = passenger.getAge();

                if (passengerName.isEmpty()) {
                    throw new RuntimeException("Passenger name is required for seat " + seat.getSeatNumber());
                }
                if (passengerAge == null || passengerAge <= 0) {
                    throw new RuntimeException("Valid passenger age is required for seat " + seat.getSeatNumber());
                }
                if (passengerGender.isEmpty()) {
                    throw new RuntimeException("Passenger gender is required for seat " + seat.getSeatNumber());
                }

                Bus bus = seat.getBus();

                Booking booking = new Booking();
                booking.setSeatNumber(seat.getSeatNumber());
                booking.setSeat(seat);
                booking.setBus(bus);
                booking.setUser(user);
                booking.setAmount(seat.getPrice());
                booking.setBookingStatus("PENDING");
                booking.setPaymentStatus("PENDING");
                booking.setUtrNumber(normalizedUtr);
                booking.setPassengerName(passengerName);
                booking.setPassengerAge(passengerAge);
                booking.setPassengerGender(passengerGender);
                booking.setPassengerPhone(passengerPhone.isEmpty() ? null : passengerPhone);
                booking.setBookingTime(LocalDateTime.now());

                bookings.add(booking);
            }

            return bookingRepository.saveAll(bookings);
        } catch (RuntimeException e) {
            emailService.sendPaymentFailedEmail(user, normalizedUtr, e.getMessage());
            throw e;
        }
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findByPaymentStatus("PENDING");
    }

    public Booking approveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentStatus("APPROVED");
        booking.setBookingStatus("BOOKED");

        Seat seat = booking.getSeat();
        seat.setStatus("BOOKED");
        seat.setLockedAt(null);

        seatRepository.save(seat);

        Booking savedBooking = bookingRepository.save(booking);

        try {
            emailService.sendBookingConfirmation(savedBooking);
        } catch (Exception e) {
            System.out.println("Failed to send email: " + e.getMessage());
        }

        return savedBooking;
    }

    public Booking rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentStatus("REJECTED");
        booking.setBookingStatus("FAILED");

        Seat seat = booking.getSeat();
        seat.setStatus("AVAILABLE");
        seat.setLockedAt(null);

        seatRepository.save(seat);

        Booking rejected = bookingRepository.save(booking);
        emailService.sendPaymentFailedEmail(
                rejected.getUser(),
                rejected.getUtrNumber(),
                "Payment was rejected by admin"
        );

        return rejected;
    }
}
