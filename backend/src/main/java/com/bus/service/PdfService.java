package com.bus.service;

import com.bus.entity.Booking;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {


    public byte[] generateTicket(Booking booking) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        String passengerName = booking.getPassengerName() != null && !booking.getPassengerName().trim().isEmpty()
                ? booking.getPassengerName().trim()
                : booking.getUser().getName();
        String passengerAge = booking.getPassengerAge() == null ? "N/A" : String.valueOf(booking.getPassengerAge());
        String passengerGender = booking.getPassengerGender() == null || booking.getPassengerGender().trim().isEmpty()
                ? "N/A"
                : booking.getPassengerGender().trim();
        String passengerPhone = booking.getPassengerPhone() == null || booking.getPassengerPhone().trim().isEmpty()
                ? "N/A"
                : booking.getPassengerPhone().trim();

        document.add(new Paragraph("BUS RESERVATION TICKET"));
        document.add(new Paragraph("---------------------------"));

        document.add(new Paragraph("Passenger : " + passengerName));
        document.add(new Paragraph("Age/Gender : " + passengerAge + " / " + passengerGender));
        document.add(new Paragraph("Passenger Phone : " + passengerPhone));
        document.add(new Paragraph("Email : " + booking.getUser().getEmail()));

        document.add(new Paragraph("Bus : " + booking.getBus().getBusName()));
        document.add(new Paragraph("Seat : " + booking.getSeatNumber()));

        document.add(new Paragraph("From : " + booking.getBus().getFromCity()));
        document.add(new Paragraph("To : " + booking.getBus().getToCity()));

        document.add(new Paragraph("Date : " + booking.getBus().getTravelDate()));
        document.add(new Paragraph("Amount Paid : ₹" + booking.getAmount()));

        document.add(new Paragraph("---------------------------"));
        document.add(new Paragraph("Have a safe journey!"));

        document.close();

        return out.toByteArray();
    }


}
