CREATE TYPE if not exist "user_role" AS ENUM('user', 'content_editor', 'reviewer', 'super_admin');--> statement-breakpoint
CREATE TABLE "resources" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"is_published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DROP TABLE "users" cascade;--> statement-breakpoint
ALTER TABLE "answers" DROP CONSTRAINT "answers_user_id_fkey", ADD CONSTRAINT "answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id");--> statement-breakpoint
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_user_id_fkey", ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id");--> statement-breakpoint
ALTER TABLE "entitlements" DROP CONSTRAINT "entitlements_user_id_fkey", ADD CONSTRAINT "entitlements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id");--> statement-breakpoint
ALTER TABLE "error_reports" DROP CONSTRAINT "error_reports_user_id_fkey", ADD CONSTRAINT "error_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id");--> statement-breakpoint
ALTER TABLE "exam_sessions" DROP CONSTRAINT "exam_sessions_user_id_fkey", ADD CONSTRAINT "exam_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id");--> statement-breakpoint
ALTER TABLE "organization_admins" DROP CONSTRAINT "organization_admins_user_id_fkey", ADD CONSTRAINT "organization_admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id");--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_reviewed_by_fkey", ADD CONSTRAINT "questions_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "neon_auth"."user"("id");--> statement-breakpoint
ALTER TABLE "review_queue" DROP CONSTRAINT "review_queue_user_id_fkey", ADD CONSTRAINT "review_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id");