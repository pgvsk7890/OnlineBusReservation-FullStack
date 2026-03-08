package com.bus.repository;

import com.bus.entity.Seat;
import com.bus.entity.Bus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    // Get all seats for a specific bus
    List<Seat> findByBus(Bus bus);

    // Get seats by status (AVAILABLE / LOCKED / BOOKED)
    List<Seat> findByStatus(String status);

    // Get seats by bus and status
    List<Seat> findByBusAndStatus(Bus bus, String status);

}