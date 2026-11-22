DROP INDEX "bookmarks_user_id_idx_6c952402";--> statement-breakpoint
DROP INDEX "bookmarks_user_id_created_at_idx_b562028f";--> statement-breakpoint
DROP INDEX "bookmarks_question_id_idx_fcfb223c";--> statement-breakpoint
ALTER TABLE "bookmarks" ADD COLUMN "id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "consentTermsAt" timestamp(3) with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "consent_terms_at";--> statement-breakpoint
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_pkey";--> statement-breakpoint
ALTER TABLE "bookmarks" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_question_unique" UNIQUE("user_id","question_id");--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_key" UNIQUE("user_id");--> statement-breakpoint
CREATE INDEX "bookmarks_user_id_idx" ON "bookmarks" ("user_id");--> statement-breakpoint
CREATE INDEX "bookmarks_user_id_created_at_idx" ON "bookmarks" ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "bookmarks_question_id_idx" ON "bookmarks" ("question_id");--> statement-breakpoint
CREATE INDEX "users_specialty_id_idx_04170370" ON "user" ("specialty_id");--> statement-breakpoint
CREATE INDEX "users_organization_id_idx_1a5cd3f5" ON "user" ("organization_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "users_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");