package com.bus.dto;

import java.util.List;

public class CreateBookingRequest {

    private List<Long> seatIds;
    private Long userId;
    private String utrNumber;
    private List<PassengerDetailRequest> passengers;

    public List<Long> getSeatIds() { return seatIds; }
    public void setSeatIds(List<Long> seatIds) { this.seatIds = seatIds; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }

    public List<PassengerDetailRequest> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerDetailRequest> passengers) { this.passengers = passengers; }
}
