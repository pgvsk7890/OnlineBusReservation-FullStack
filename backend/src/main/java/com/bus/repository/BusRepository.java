package com.bus.repository;

import com.bus.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusRepository extends JpaRepository<Bus,Long> {

    List<Bus> findByFromCityAndToCityAndTravelDate(String fromCity,String toCity,String travelDate);

}