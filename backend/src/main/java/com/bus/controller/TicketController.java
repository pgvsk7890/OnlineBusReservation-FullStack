package com.bus.controller;

import com.bus.entity.Ticket;
import com.bus.service.TicketService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ticket")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    @Autowired
    private TicketService ticketService;


    // ================= CREATE TICKET =================

    @PostMapping("/create/{userId}")
    public Ticket createTicket(
            @PathVariable Long userId,
            @RequestBody Ticket ticket
    ){
        return ticketService.createTicket(userId, ticket);
    }


    // ================= ADMIN - GET ALL TICKETS =================

    @GetMapping("/all")
    public List<Ticket> getAllTickets(){
        return ticketService.getAllTickets();
    }


    // ================= USER - GET USER TICKETS =================

    @GetMapping("/user/{userId}")
    public List<Ticket> getUserTickets(@PathVariable Long userId){
        return ticketService.getTicketsByUser(userId);
    }


    // ================= ADMIN RESPONSE =================

    @PutMapping("/respond/{id}")
    public Ticket respondTicket(
            @PathVariable Long id,
            @RequestBody Map<String,String> body
    ){
        return ticketService.respondTicket(id, body.get("response"));
    }

}