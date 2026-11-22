ALTER TABLE "user" DROP CONSTRAINT "users_specialty_id_fkey";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_organization_id_fkey";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "consentTermsAt" TO "consent_terms_at";--> statement-breakpoint
DROP INDEX "users_specialty_id_idx_04170370";--> statement-breakpoint
DROP INDEX "users_organization_id_idx_1a5cd3f5";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "specialty_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "professional_status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "hcp_verified" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE text USING "role"::text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "consent_terms_at" SET DATA TYPE timestamp USING "consent_terms_at"::timestamp;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "consent_terms_at" DROP NOT NULL;--> statement-breakpoint
DROP TYPE "user_role";