import { pgTable, pgEnum, text, timestamp, integer, boolean, json, doublePrecision, index, foreignKey, primaryKey, unique, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const userRole = pgEnum("user_role", ["user", "content_editor", "reviewer", "super_admin"])


export const account = pgTable("account", {
	id: text().primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast()),
]);

export const answers = pgTable("answers", {
	id: text().primaryKey(),
	userId: text("user_id").notNull(),
	questionId: text("question_id").notNull(),
	questionVersion: integer("question_version").notNull(),
	selectedOptionId: text("selected_option_id").notNull(),
	isCorrect: boolean("is_correct").notNull(),
	mode: text().notNull(),
	answeredAt: timestamp("answered_at", { precision: 3, withTimezone: true }).default(sql`now()`).notNull(),
	examSessionId: text("exam_session_id"),
}, (table) => [
	foreignKey({
		columns: [table.examSessionId],
		foreignColumns: [examSessions.id],
		name: "answers_exam_session_id_fkey"
	}),
	foreignKey({
		columns: [table.questionId],
		foreignColumns: [questions.id],
		name: "answers_question_id_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "answers_user_id_fkey"
	}),
	index("answers_exam_session_id_idx_d2694f5f").using("btree", table.examSessionId.asc().nullsLast()),
	index("answers_question_id_idx_fcfb223c").using("btree", table.questionId.asc().nullsLast()),
	index("answers_user_id_answered_at_idx_7771bd3c").using("btree", table.userId.asc().nullsLast(), table.answeredAt.asc().nullsLast()),
	index("answers_user_id_idx_6c952402").using("btree", table.userId.asc().nullsLast()),
	index("answers_user_id_question_id_answered_at_idx_faa91429").using("btree", table.userId.asc().nullsLast(), table.questionId.asc().nullsLast(), table.answeredAt.asc().nullsLast()),
]);

export const bookmarks = pgTable("bookmarks", {
	userId: text("user_id").notNull(),
	questionId: text("question_id").notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true }).default(sql`now()`).notNull(),
	id: text().primaryKey(),
}, (table) => [
	foreignKey({
		columns: [table.questionId],
		foreignColumns: [questions.id],
		name: "bookmarks_question_id_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "bookmarks_user_id_fkey"
	}),
	index("bookmarks_question_id_idx").using("btree", table.questionId.asc().nullsLast()),
	index("bookmarks_user_id_created_at_idx").using("btree", table.userId.asc().nullsLast(), table.createdAt.asc().nullsLast()),
	index("bookmarks_user_id_idx").using("btree", table.userId.asc().nullsLast()),
	unique("bookmarks_user_question_unique").on(table.userId, table.questionId),]);

export const calculators = pgTable("calculators", {
	id: text().primaryKey(),
	slug: text().notNull(),
	nameHy: text("name_hy").notNull(),
	config: json().notNull(),
	source: text().notNull(),
	isPublished: boolean("is_published").default(false).notNull(),
}, (table) => [
	index("calculators_is_published_idx_524f5def").using("btree", table.isPublished.asc().nullsLast()),
	unique("calculators_slug_key").on(table.slug),]);

export const codeBatchSpecialties = pgTable("code_batch_specialties", {
	batchId: text("batch_id").notNull(),
	specialtyId: text("specialty_id").notNull(),
}, (table) => [
	primaryKey({ columns: [table.batchId, table.specialtyId], name: "code_batch_specialties_pkey"}),
	foreignKey({
		columns: [table.batchId],
		foreignColumns: [codeBatches.id],
		name: "code_batch_specialties_batch_id_fkey"
	}),
	foreignKey({
		columns: [table.specialtyId],
		foreignColumns: [specialties.id],
		name: "code_batch_specialties_specialty_id_fkey"
	}),
	index("code_batch_specialties_batch_id_idx_49ba28fa").using("btree", table.batchId.asc().nullsLast()),
	index("code_batch_specialties_specialty_id_idx_04170370").using("btree", table.specialtyId.asc().nullsLast()),
]);

export const codeBatches = pgTable("code_batches", {
	id: text().primaryKey(),
	sponsorId: text("sponsor_id"),
	durationDays: integer("duration_days").notNull(),
	expiresAt: timestamp("expires_at", { precision: 3, withTimezone: true }).notNull(),
	type: text().notNull(),
	maxUses: integer("max_uses").default(1).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.sponsorId],
		foreignColumns: [sponsors.id],
		name: "code_batches_sponsor_id_fkey"
	}),
	index("code_batches_expires_at_idx_35365ada").using("btree", table.expiresAt.asc().nullsLast()),
	index("code_batches_sponsor_id_idx_5dec6ff5").using("btree", table.sponsorId.asc().nullsLast()),
]);

export const codes = pgTable("codes", {
	id: text().primaryKey(),
	batchId: text("batch_id").notNull(),
	code: text().notNull(),
	uses: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.batchId],
		foreignColumns: [codeBatches.id],
		name: "codes_batch_id_fkey"
	}),
	index("codes_batch_id_idx_49ba28fa").using("btree", table.batchId.asc().nullsLast()),
	unique("codes_code_key").on(table.code),]);

export const entitlements = pgTable("entitlements", {
	id: text().primaryKey(),
	userId: text("user_id").notNull(),
	specialtyId: text("specialty_id"),
	source: text().notNull(),
	sourceRef: text("source_ref").notNull(),
	startsAt: timestamp("starts_at", { precision: 3, withTimezone: true }).default(sql`now()`).notNull(),
	endsAt: timestamp("ends_at", { precision: 3, withTimezone: true }),
}, (table) => [
	foreignKey({
		columns: [table.specialtyId],
		foreignColumns: [specialties.id],
		name: "entitlements_specialty_id_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "entitlements_user_id_fkey"
	}),
	index("entitlements_source_source_ref_idx_5f6ab958").using("btree", table.source.asc().nullsLast(), table.sourceRef.asc().nullsLast()),
	index("entitlements_specialty_id_idx_04170370").using("btree", table.specialtyId.asc().nullsLast()),
	index("entitlements_user_id_idx_6c952402").using("btree", table.userId.asc().nullsLast()),
	index("entitlements_user_id_specialty_id_ends_at_idx_1e5b227f").using("btree", table.userId.asc().nullsLast(), table.specialtyId.asc().nullsLast(), table.endsAt.asc().nullsLast()),
	unique("entitlements_user_id_key").on(table.userId),]);

export const errorReports = pgTable("error_reports", {
	id: text().primaryKey(),
	userId: text("user_id"),
	questionId: text("question_id").notNull(),
	type: text().notNull(),
	text: text().notNull(),
	status: text().default("new").notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true }).default(sql`now()`).notNull(),
	resolvedAt: timestamp("resolved_at", { precision: 3, withTimezone: true }),
}, (table) => [
	foreignKey({
		columns: [table.questionId],
		foreignColumns: [questions.id],
		name: "error_reports_question_id_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "error_reports_user_id_fkey"
	}),
	index("error_reports_question_id_idx_fcfb223c").using("btree", table.questionId.asc().nullsLast()),
	index("error_reports_status_created_at_idx_1bbe8adf").using("btree", table.status.asc().nullsLast(), table.createdAt.asc().nullsLast()),
	index("error_reports_user_id_idx_6c952402").using("btree", table.userId.asc().nullsLast()),
]);

export const examSessions = pgTable("exam_sessions", {
	id: text().primaryKey(),
	userId: text("user_id").notNull(),
	specialtyId: text("specialty_id").notNull(),
	questionIds: text("question_ids").array().default([]).notNull(),
	startedAt: timestamp("started_at", { precision: 3, withTimezone: true }).default(sql`now()`).notNull(),
	finishedAt: timestamp("finished_at", { precision: 3, withTimezone: true }),
	durationLimit: integer("duration_limit").notNull(),
	score: doublePrecision(),
	passed: boolean(),
}, (table) => [
	foreignKey({
		columns: [table.specialtyId],
		foreignColumns: [specialties.id],
		name: "exam_sessions_specialty_id_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "exam_sessions_user_id_fkey"
	}),
	index("exam_sessions_specialty_id_idx_04170370").using("btree", table.specialtyId.asc().nullsLast()),
	index("exam_sessions_user_id_idx_6c952402").using("btree", table.userId.asc().nullsLast()),
	index("exam_sessions_user_id_started_at_idx_beb66913").using("btree", table.userId.asc().nullsLast(), table.startedAt.asc().nullsLast()),
check("exam_sessions_question_ids_no_nulls", sql`(array_position(question_ids, NULL::text) IS NULL)`),]);

export const organizationAdmins = pgTable("organization_admins", {
	organizationId: text("organization_id").notNull(),
	userId: text("user_id").notNull(),
}, (table) => [
	primaryKey({ columns: [table.organizationId, table.userId], name: "organization_admins_pkey"}),
	foreignKey({
		columns: [table.organizationId],
		foreignColumns: [organizations.id],
		name: "organization_admins_organization_id_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "organization_admins_user_id_fkey"
	}),
	index("organization_admins_organization_id_idx_1a5cd3f5").using("btree", table.organizationId.asc().nullsLast()),
	index("organization_admins_user_id_idx_6c952402").using("btree", table.userId.asc().nullsLast()),
]);

export const organizations = pgTable("organizations", {
	id: text().primaryKey(),
	name: text().notNull(),
	licenseCount: integer("license_count").notNull(),
	licenseUntil: timestamp("license_until", { precision: 3, withTimezone: true }).notNull(),
});

export const questionTopics = pgTable("question_topics", {
	questionId: text("question_id").notNull(),
	topicId: text("topic_id").notNull(),
}, (table) => [
	primaryKey({ columns: [table.questionId, table.topicId], name: "question_topics_pkey"}),
	foreignKey({
		columns: [table.questionId],
		foreignColumns: [questions.id],
		name: "question_topics_question_id_fkey"
	}),
	foreignKey({
		columns: [table.topicId],
		foreignColumns: [topics.id],
		name: "question_topics_topic_id_fkey"
	}),
	index("question_topics_question_id_idx_fcfb223c").using("btree", table.questionId.asc().nullsLast()),
	index("question_topics_topic_id_idx_334b0e8b").using("btree", table.topicId.asc().nullsLast()),
]);

export const questions = pgTable("questions", {
	id: text().primaryKey(),
	specialtyId: text("specialty_id").notNull(),
	sectionId: text("section_id").notNull(),
	number: integer().notNull(),
	stem: text().notNull(),
	options: json().default([]).notNull(),
	sources: json().default([]).notNull(),
	correctOptionId: text("correct_option_id").notNull(),
	explanation: text().notNull(),
	note: text(),
	shuffle: boolean().default(true).notNull(),
	status: text().default("draft").notNull(),
	reviewComment: text("review_comment"),
	version: integer().default(1).notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true }).notNull(),
	reviewedBy: text("reviewed_by"),
	reviewedAt: timestamp("reviewed_at", { precision: 3, withTimezone: true }),
}, (table) => [
	foreignKey({
		columns: [table.reviewedBy],
		foreignColumns: [user.id],
		name: "questions_reviewed_by_fkey"
	}),
	foreignKey({
		columns: [table.sectionId],
		foreignColumns: [sections.id],
		name: "questions_section_id_fkey"
	}),
	foreignKey({
		columns: [table.specialtyId],
		foreignColumns: [specialties.id],
		name: "questions_specialty_id_fkey"
	}),
	index("questions_reviewed_by_idx_ef840284").using("btree", table.reviewedBy.asc().nullsLast()),
	index("questions_section_id_idx_13db6de7").using("btree", table.sectionId.asc().nullsLast()),
	index("questions_section_id_status_idx_a0e1b6e6").using("btree", table.sectionId.asc().nullsLast(), table.status.asc().nullsLast()),
	index("questions_specialty_id_idx_04170370").using("btree", table.specialtyId.asc().nullsLast()),
	index("questions_specialty_id_status_number_idx_48ef38b1").using("btree", table.specialtyId.asc().nullsLast(), table.status.asc().nullsLast(), table.number.asc().nullsLast()),
	index("questions_status_updated_at_idx_b01876cb").using("btree", table.status.asc().nullsLast(), table.updatedAt.asc().nullsLast()),
]);

export const resources = pgTable("resources", {
	id: text().primaryKey(),
	title: text().notNull(),
	url: text().notNull(),
	description: text(),
	isPublished: boolean("is_published").default(false).notNull(),
});

export const reviewQueue = pgTable("review_queue", {
	userId: text("user_id").notNull(),
	questionId: text("question_id").notNull(),
	stage: integer().default(0).notNull(),
	nextReviewAt: timestamp("next_review_at", { precision: 3, withTimezone: true }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.userId, table.questionId], name: "review_queue_pkey"}),
	foreignKey({
		columns: [table.questionId],
		foreignColumns: [questions.id],
		name: "review_queue_question_id_fkey"
	}),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "review_queue_user_id_fkey"
	}),
	index("review_queue_question_id_idx_fcfb223c").using("btree", table.questionId.asc().nullsLast()),
	index("review_queue_user_id_idx_6c952402").using("btree", table.userId.asc().nullsLast()),
	index("review_queue_user_id_next_review_at_idx_8ea0b1b0").using("btree", table.userId.asc().nullsLast(), table.nextReviewAt.asc().nullsLast()),
]);

export const sections = pgTable("sections", {
	id: text().primaryKey(),
	specialtyId: text("specialty_id").notNull(),
	nameHy: text("name_hy").notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.specialtyId],
		foreignColumns: [specialties.id],
		name: "sections_specialty_id_fkey"
	}),
	index("sections_specialty_id_idx_04170370").using("btree", table.specialtyId.asc().nullsLast()),
	index("sections_specialty_id_sort_order_idx_708de791").using("btree", table.specialtyId.asc().nullsLast(), table.sortOrder.asc().nullsLast()),
]);

export const session = pgTable("session", {
	id: text().primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast()),
	unique("session_token_key").on(table.token),]);

export const specialties = pgTable("specialties", {
	id: text().primaryKey(),
	nameHy: text("name_hy").notNull(),
	slug: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isPublished: boolean("is_published").default(false).notNull(),
	sponsorId: text("sponsor_id"),
	sponsorUntil: timestamp("sponsor_until", { precision: 3, withTimezone: true }),
}, (table) => [
	foreignKey({
		columns: [table.sponsorId],
		foreignColumns: [sponsors.id],
		name: "specialties_sponsor_id_fkey"
	}),
	index("specialties_is_published_sort_order_idx_b75878b6").using("btree", table.isPublished.asc().nullsLast(), table.sortOrder.asc().nullsLast()),
	index("specialties_sponsor_id_idx_5dec6ff5").using("btree", table.sponsorId.asc().nullsLast()),
	unique("specialties_slug_key").on(table.slug),]);

export const sponsors = pgTable("sponsors", {
	id: text().primaryKey(),
	name: text().notNull(),
	logoUrl: text("logo_url").notNull(),
	website: text().notNull(),
	contact: text().notNull(),
});

export const topics = pgTable("topics", {
	id: text().primaryKey(),
	specialtyId: text("specialty_id").notNull(),
	nameHy: text("name_hy").notNull(),
}, (table) => [
	foreignKey({
		columns: [table.specialtyId],
		foreignColumns: [specialties.id],
		name: "topics_specialty_id_fkey"
	}),
	index("topics_specialty_id_idx_04170370").using("btree", table.specialtyId.asc().nullsLast()),
]);

export const user = pgTable("user", {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	specialtyId: text("specialty_id").notNull(),
	professionalStatus: text("professional_status").notNull(),
	workplace: text(),
	registryNumber: text("registry_number"),
	hcpVerified: text("hcp_verified").default("none").notNull(),
	organizationId: text("organization_id"),
	consentTermsAt: timestamp("consent_terms_at", { precision: 3, withTimezone: true }).notNull(),
	consentMarketing: boolean("consent_marketing").default(false).notNull(),
	role: userRole().default("user").notNull(),
}, (table) => [
	unique("user_email_key").on(table.email),]);

export const verification = pgTable("verification", {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast()),
]);
