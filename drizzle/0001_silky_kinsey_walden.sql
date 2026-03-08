CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('draft','submitted','payment_declared','paid','rejected') NOT NULL DEFAULT 'draft',
	`submittedBy` int NOT NULL,
	`submittedAt` timestamp,
	`approvedBy` int,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`propertyId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('pending','assigned','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`assignedToId` int,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`address` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(50) NOT NULL,
	`zipCode` varchar(20) NOT NULL,
	`ownerId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
