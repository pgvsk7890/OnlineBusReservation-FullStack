package com.bus.repository;

import com.bus.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket,Long> {


    List<Ticket> findByUserId(Long user);


}
