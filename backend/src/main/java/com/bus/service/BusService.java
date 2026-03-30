package com.bus.service;

import com.bus.entity.Bus;
import com.bus.entity.Seat;
import com.bus.repository.BusRepository;
import com.bus.repository.BookingRepository;
import com.bus.repository.SeatRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Bus addBus(Bus bus){

        Bus savedBus = busRepository.save(bus);

        Double seaterPrice = bus.getSeaterPrice();
        Double sleeperPrice = bus.getSleeperPrice();

        // 18 SEATER seats
        for(int i=1; i<=18; i++){

            Seat seat = new Seat();

            seat.setSeatNumber("S" + i);
            seat.setSeatType("SEATER");
            seat.setPrice(seaterPrice);
            seat.setStatus("AVAILABLE");
            seat.setBus(savedBus);

            seatRepository.save(seat);
        }

        // 20 SLEEPER seats
        for(int i=19; i<=38; i++){

            Seat seat = new Seat();

            seat.setSeatNumber("S" + i);
            seat.setSeatType("SLEEPER");
            seat.setPrice(sleeperPrice);
            seat.setStatus("AVAILABLE");
            seat.setBus(savedBus);

            seatRepository.save(seat);
        }

        return savedBus;
    }

    public List<Bus> getAllBuses(){
        return busRepository.findAll();
    }

    @Transactional
    public void deleteBus(Long id){

        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        // Remove dependent bookings first to satisfy FK constraints.
        bookingRepository.deleteAll(bookingRepository.findByBus(bus));

        // delete seats first
        seatRepository.deleteAll(
                seatRepository.findByBus(bus)
        );

        // then delete bus
        busRepository.delete(bus);
    }

    public List<Bus> searchBus(String from, String to, String date){
        return busRepository.findByFromCityAndToCity(from, to);
    }

    public List<Seat> getSeats(Long busId){

        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        return seatRepository.findByBus(bus);
    }

    public Bus updateBus(Long id, Bus bus){

        Bus existingBus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        existingBus.setBusName(bus.getBusName());
        existingBus.setBusNumber(bus.getBusNumber());
        existingBus.setBusType(bus.getBusType());
        existingBus.setFromCity(bus.getFromCity());
        existingBus.setToCity(bus.getToCity());
        existingBus.setDepartureTime(bus.getDepartureTime());
        existingBus.setArrivalTime(bus.getArrivalTime());
        existingBus.setSeaterPrice(bus.getSeaterPrice());
        existingBus.setSleeperPrice(bus.getSleeperPrice());

        Bus savedBus = busRepository.save(existingBus);

        List<Seat> seats = seatRepository.findByBus(existingBus);
        for (Seat seat : seats) {
            if ("SEATER".equals(seat.getSeatType())) {
                seat.setPrice(bus.getSeaterPrice());
            } else if ("SLEEPER".equals(seat.getSeatType())) {
                seat.setPrice(bus.getSleeperPrice());
            }
            seatRepository.save(seat);
        }

        return savedBus;
    }

    public Seat updateSeatPrice(Long seatId, Double price){

        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        seat.setPrice(price);

        return seatRepository.save(seat);

    }
}
