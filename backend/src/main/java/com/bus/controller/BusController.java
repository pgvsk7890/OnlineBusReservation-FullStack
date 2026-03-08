package com.bus.controller;

import com.bus.entity.Bus;
import com.bus.entity.Seat;
import com.bus.service.BusService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bus")
@CrossOrigin(origins = "http://localhost:5173")
public class BusController {

    @Autowired
    private BusService busService;

    // Add Bus
    @PostMapping("/add")
    public ResponseEntity<?> addBus(@RequestBody Bus bus) {

        try {

            Bus savedBus = busService.addBus(bus);

            return ResponseEntity.ok(savedBus);

        } catch (Exception e) {

            return ResponseEntity.badRequest().body("Failed to add bus");

        }

    }

    // Get All Buses
    @GetMapping("/all")
    public ResponseEntity<List<Bus>> getAllBuses() {

        return ResponseEntity.ok(busService.getAllBuses());

    }

    // Delete Bus
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBus(@PathVariable Long id) {

        try {

            busService.deleteBus(id);

            return ResponseEntity.ok("Bus deleted successfully");

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }

    }

    // Search Bus (User Side)
    @GetMapping("/search")
    public ResponseEntity<List<Bus>> searchBus(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String date
    ) {

        return ResponseEntity.ok(busService.searchBus(from, to, date));

    }

    // Get Seats of a Bus
    @GetMapping("/seats/{busId}")
    public ResponseEntity<List<Seat>> getSeats(@PathVariable Long busId) {

        return ResponseEntity.ok(busService.getSeats(busId));

    }

    // Update Bus (Admin)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateBus(
            @PathVariable Long id,
            @RequestBody Bus bus
    ) {

        try {

            Bus updatedBus = busService.updateBus(id, bus);

            return ResponseEntity.ok(updatedBus);

        } catch (Exception e) {

            return ResponseEntity.badRequest().body("Bus update failed");

        }

    }

    @PutMapping("/seatPrice/{seatId}")
    public ResponseEntity<?> updateSeatPrice(
            @PathVariable Long seatId,
            @RequestBody Seat seat
    ){

        try{

            Seat updatedSeat = busService.updateSeatPrice(seatId, seat.getPrice());

            return ResponseEntity.ok(updatedSeat);

        }catch(Exception e){

            return ResponseEntity.badRequest().body("Failed to update seat price");

        }

    }

}
