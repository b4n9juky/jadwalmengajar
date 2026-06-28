CREATE TABLE `assignments` (
	`id` varchar(36) NOT NULL,
	`teacher_id` varchar(36) NOT NULL,
	`subject_id` varchar(36) NOT NULL,
	`class_id` varchar(36) NOT NULL,
	`sessions_per_week` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `availabilities` (
	`id` varchar(36) NOT NULL,
	`teacher_id` varchar(36) NOT NULL,
	`day_of_week` int NOT NULL,
	`start_time` varchar(5) NOT NULL,
	`end_time` varchar(5) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `availabilities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` varchar(36) NOT NULL,
	`name` varchar(50) NOT NULL,
	`grade_level` int NOT NULL,
	`section` varchar(10) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` varchar(36) NOT NULL,
	`name` varchar(200) NOT NULL,
	`code` varchar(20) NOT NULL,
	`capacity` int NOT NULL DEFAULT 30,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` varchar(36) NOT NULL,
	`teacher_id` varchar(36) NOT NULL,
	`subject_id` varchar(36) NOT NULL,
	`class_id` varchar(36) NOT NULL,
	`room_id` varchar(36) NOT NULL,
	`time_slot_id` varchar(36) NOT NULL,
	`is_auto_generated` tinyint NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` varchar(36) NOT NULL,
	`name` varchar(200) NOT NULL,
	`code` varchar(20) NOT NULL,
	`total_sessions` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` varchar(36) NOT NULL,
	`name` varchar(200) NOT NULL,
	`nip` varchar(30) NOT NULL,
	`phone` varchar(20),
	`email` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teachers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `time_slots` (
	`id` varchar(36) NOT NULL,
	`day_of_week` int NOT NULL,
	`start_time` varchar(5) NOT NULL,
	`end_time` varchar(5) NOT NULL,
	`type` enum('teaching','break') NOT NULL DEFAULT 'teaching',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `time_slots_id` PRIMARY KEY(`id`)
);
