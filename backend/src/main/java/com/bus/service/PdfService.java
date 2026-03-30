package com.bus.service;

import com.bus.entity.Booking;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generateTicket(Booking booking) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        document.setMargins(24, 24, 24, 24);

        String bookingStatus = safe(booking.getBookingStatus());
        String paymentStatus = safe(booking.getPaymentStatus());
        String utrNumber = safe(booking.getUtrNumber());
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
        String userEmail = booking.getUser() != null ? safe(booking.getUser().getEmail()) : "N/A";
        String bookingTime = booking.getBookingTime() == null
                ? "N/A"
                : booking.getBookingTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        String busName = booking.getBus() != null ? safe(booking.getBus().getBusName()) : "N/A";
        String busNumber = booking.getBus() != null ? safe(booking.getBus().getBusNumber()) : "N/A";
        String busType = booking.getBus() != null ? safe(booking.getBus().getBusType()) : "N/A";
        String fromCity = booking.getBus() != null ? safe(booking.getBus().getFromCity()) : "N/A";
        String toCity = booking.getBus() != null ? safe(booking.getBus().getToCity()) : "N/A";
        String departureTime = booking.getBus() != null ? safe(booking.getBus().getDepartureTime()) : "N/A";
        String arrivalTime = booking.getBus() != null ? safe(booking.getBus().getArrivalTime()) : "N/A";
        String travelDate = booking.getTravelDate() == null || booking.getTravelDate().trim().isEmpty()
                ? (booking.getBus() != null ? safe(booking.getBus().getTravelDate()) : "N/A")
                : booking.getTravelDate().trim();
        String amountPaid = booking.getAmount() == null
                ? "INR 0.00"
                : "INR " + String.format("%.2f", booking.getAmount());

        Paragraph title = new Paragraph("BUS RESERVATION TICKET")
                .setFontSize(18)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER);
        Paragraph subtitle = new Paragraph("Booking ID: " + booking.getId() + "  |  " + bookingStatus)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.DARK_GRAY);
        document.add(title);
        document.add(subtitle);
        document.add(new LineSeparator(new SolidLine()));

        Table table = new Table(UnitValue.createPercentArray(new float[] { 32, 68 }))
                .useAllAvailableWidth()
                .setMarginTop(10);

        addSectionHeader(table, "BOOKING STATUS");
        addRow(table, "Booking Status", bookingStatus);
        addRow(table, "Payment Status", paymentStatus);
        addRow(table, "UTR / Ref No.", utrNumber);
        addRow(table, "Booked At", bookingTime);

        addSectionHeader(table, "PASSENGER DETAILS");
        addRow(table, "Passenger", passengerName);
        addRow(table, "Age / Gender", passengerAge + " / " + passengerGender);
        addRow(table, "Phone", passengerPhone);
        addRow(table, "Email", userEmail);

        addSectionHeader(table, "TRIP DETAILS");
        addRow(table, "Bus", busName);
        addRow(table, "Bus Number", busNumber);
        addRow(table, "Bus Type", busType);
        addRow(table, "Seat", booking.getSeatNumber());
        addRow(table, "From", fromCity);
        addRow(table, "To", toCity);
        addRow(table, "Departure Time", departureTime);
        addRow(table, "Arrival Time", arrivalTime);
        addRow(table, "Travel Date", travelDate);

        addSectionHeader(table, "PAYMENT");
        addRow(table, "Amount Paid", amountPaid);

        document.add(table);
        document.add(new LineSeparator(new SolidLine()));
        document.add(new Paragraph("Have a safe journey!")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(11)
                .setMarginTop(6));

        document.close();

        return out.toByteArray();
    }

    private void addSectionHeader(Table table, String title) {
        Cell cell = new Cell(1, 2)
                .add(new Paragraph(title).setBold().setFontSize(11))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setBorder(Border.NO_BORDER)
                .setPadding(6);
        table.addHeaderCell(cell);
    }

    private void addRow(Table table, String label, String value) {
        Cell labelCell = new Cell()
                .add(new Paragraph(label).setBold())
                .setBackgroundColor(ColorConstants.WHITE)
                .setPadding(6);
        Cell valueCell = new Cell()
                .add(new Paragraph(value == null || value.trim().isEmpty() ? "N/A" : value))
                .setPadding(6);
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private String safe(String value) {
        return value == null || value.trim().isEmpty() ? "N/A" : value.trim();
    }

}
