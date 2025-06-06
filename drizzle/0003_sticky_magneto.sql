PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_role_permissions` (
	`role_id` integer,
	`resource_id` integer,
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
PRAGMA foreign_keys=ON;