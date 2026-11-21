ALTER TABLE "answers" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "entitlements" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "error_reports" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "error_reports" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exam_sessions" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "organization_admins" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "reviewed_by" SET DATA TYPE uuid USING "reviewed_by"::uuid;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "reviewed_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "review_queue" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
DROP TYPE "user_role";