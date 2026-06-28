ALTER TABLE `assignments` ADD `academic_year_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `availabilities` ADD `academic_year_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `classes` ADD `academic_year_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` ADD `academic_year_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `schedules` ADD `academic_year_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `subjects` ADD `academic_year_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `teachers` ADD `academic_year_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `time_slots` ADD `academic_year_id` varchar(36) NOT NULL;