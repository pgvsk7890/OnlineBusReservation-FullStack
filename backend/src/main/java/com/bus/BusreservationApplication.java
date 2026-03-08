package com.bus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BusreservationApplication {

	public static void main(String[] args) {
		SpringApplication.run(BusreservationApplication.class, args);
	}

}
