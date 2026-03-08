package com.bus.schedular;

import com.bus.entity.Seat;
import com.bus.repository.SeatRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SeatReleaseScheduler {

    @Autowired
    private SeatRepository seatRepository;

    @Scheduled(fixedRate = 60000) // every 1 minute
    public void releaseSeats(){

        List<Seat> seats = seatRepository.findAll();

        for(Seat seat : seats){

            if("LOCKED".equals(seat.getStatus())){

                if(seat.getLockedAt() != null){

                    if(seat.getLockedAt().plusMinutes(7).isBefore(LocalDateTime.now())){

                        seat.setStatus("AVAILABLE");
                        seat.setLockedAt(null);

                        seatRepository.save(seat);
                    }

                }

            }

        }

    }

}