package com.bus.repository;

import com.bus.entity.Booking;
import com.bus.entity.Bus;
import com.bus.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long> {

    // user booking history
    List<Booking> findByUser(User user);

    // admin: pending payments
    List<Booking> findByPaymentStatus(String paymentStatus);

    // admin: booking status filter
    List<Booking> findByBookingStatus(String bookingStatus);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByBus(Bus bus);

}
