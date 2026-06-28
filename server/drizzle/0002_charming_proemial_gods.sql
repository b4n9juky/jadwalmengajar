CREATE TABLE `academic_years` (
	`id` varchar(36) NOT NULL,
	`tahun_ajaran` varchar(20) NOT NULL,
	`semester` enum('ganjil','genap') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academic_years_id` PRIMARY KEY(`id`)
);
