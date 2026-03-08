package com.bus.service;

import com.bus.entity.Ticket;
import com.bus.entity.User;
import com.bus.repository.TicketRepository;
import com.bus.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;


    // ================= CREATE SUPPORT TICKET =================

    public Ticket createTicket(Long userId, Ticket ticket){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ticket.setUser(user);
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }


    // ================= GET ALL TICKETS (ADMIN) =================

    public List<Ticket> getAllTickets(){
        return ticketRepository.findAll();
    }


    // ================= GET USER TICKETS =================

    public List<Ticket> getTicketsByUser(Long userId){

        return ticketRepository.findByUserId(userId);

    }


    // ================= ADMIN RESPONSE =================

    public Ticket respondTicket(Long id, String response){

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setAdminResponse(response);
        ticket.setStatus("CLOSED");
        ticket.setResolvedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

}