package com.blaze.expense.tracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ExpenseTrackingApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExpenseTrackingApplication.class, args);
	}

}
