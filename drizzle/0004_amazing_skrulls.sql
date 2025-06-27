CREATE TABLE `schedules` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`start_date` text DEFAULT CURRENT_DATE NOT NULL,
	`time_event_id` integer,
	`start_time` text DEFAULT '00:00' NOT NULL,
	`end_time` text DEFAULT '00:00' NOT NULL,
	`description` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`time_event_id`) REFERENCES `time_events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `schedules_user_date_idx` ON `schedules` (`user_id`,`start_date`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`name` text NOT NULL,
	`role_id` integer NOT NULL,
	`password_hash` text NOT NULL,
	`supervisor_id` integer,
	`local_timezone` text DEFAULT 'Asia/Manila' NOT NULL,
	`client_timezone` text DEFAULT 'Asia/Manila' NOT NULL,
	`lock_password` integer DEFAULT false NOT NULL,
	`preferences` text DEFAULT '{"background": null, "avatar": null, "mode": "light"}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`supervisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "active", "name", "role_id", "password_hash", "supervisor_id", "local_timezone", "client_timezone", "lock_password", "preferences", "created_at", "updated_at") SELECT "id", "active", "name", "role_id", "password_hash", "supervisor_id", "local_timezone", "client_timezone", "lock_password", "preferences", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `users_role_id_idx` ON `users` (`role_id`);--> statement-breakpoint
CREATE TABLE `__new_role_permissions` (
	`role_id` integer NOT NULL,
	`resource_id` integer NOT NULL,
	`can_create` integer DEFAULT false NOT NULL,
	`can_read` integer DEFAULT false NOT NULL,
	`can_update` integer DEFAULT false NOT NULL,
	`can_delete` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`role_id`, `resource_id`),
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_role_permissions`("role_id", "resource_id", "can_create", "can_read", "can_update", "can_delete") SELECT "role_id", "resource_id", "can_create", "can_read", "can_update", "can_delete" FROM `role_permissions`;--> statement-breakpoint
DROP TABLE `role_permissions`;--> statement-breakpoint
ALTER TABLE `__new_role_permissions` RENAME TO `role_permissions`;--> statement-breakpoint
CREATE INDEX `role_permissions_role_id_idx` ON `role_permissions` (`role_id`);--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);