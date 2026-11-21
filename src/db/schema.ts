import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  doublePrecision,
  foreignKey,
  index,
  integer,
  json,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const questionStatuses = [
  "draft",
  "in_review",
  "needs_check",
  "published",
  "archived",
] as const;

export const hcpVerificationStatuses = ["none", "self_declared", "verified"] as const;
export const entitlementSources = ["purchase", "code", "corporate", "admin"] as const;
export const answerModes = ["practice", "exam", "daily", "review"] as const;
export const errorReportStatuses = ["new", "accepted", "rejected", "fixed"] as const;
export const codeBatchTypes = ["single", "multi"] as const;

export type QuestionOption = { id: string; text: string };
export type QuestionSource = { title: string; url: string };

const cuidPrimaryKey = () => text().primaryKey().$defaultFn(createId);
const dateTime = () => timestamp({ withTimezone: true, precision: 3, mode: "date" });

export const sponsors = pgTable("sponsors", {
  id: cuidPrimaryKey(),
  name: text().notNull(),
  logo_url: text().notNull(),
  website: text().notNull(),
  contact: text().notNull(),
});

export const organizations = pgTable("organizations", {
  id: cuidPrimaryKey(),
  name: text().notNull(),
  license_count: integer().notNull(),
  license_until: dateTime().notNull(),
});

export const specialties = pgTable(
  "specialties",
  {
    id: cuidPrimaryKey(),
    name_hy: text().notNull(),
    slug: text().notNull().unique("specialties_slug_key"),
    sort_order: integer().notNull().default(0),
    is_published: boolean().notNull().default(false),
    sponsor_id: text(),
    sponsor_until: dateTime(),
  },
  (table) => [
    foreignKey({
      name: "specialties_sponsor_id_fkey",
      columns: [table.sponsor_id],
      foreignColumns: [sponsors.id],
    }),
    index("specialties_is_published_sort_order_idx_b75878b6").on(table.is_published, table.sort_order),
    index("specialties_sponsor_id_idx_5dec6ff5").on(table.sponsor_id),
  ],
);

export const sections = pgTable(
  "sections",
  {
    id: cuidPrimaryKey(),
    specialty_id: text().notNull(),
    name_hy: text().notNull(),
    sort_order: integer().notNull().default(0),
  },
  (table) => [
    foreignKey({
      name: "sections_specialty_id_fkey",
      columns: [table.specialty_id],
      foreignColumns: [specialties.id],
    }),
    index("sections_specialty_id_idx_04170370").on(table.specialty_id),
    index("sections_specialty_id_sort_order_idx_708de791").on(table.specialty_id, table.sort_order),
  ],
);

export const topics = pgTable(
  "topics",
  {
    id: cuidPrimaryKey(),
    specialty_id: text().notNull(),
    name_hy: text().notNull(),
  },
  (table) => [
    foreignKey({
      name: "topics_specialty_id_fkey",
      columns: [table.specialty_id],
      foreignColumns: [specialties.id],
    }),
    index("topics_specialty_id_idx_04170370").on(table.specialty_id),
  ],
);

const neonAuthUsers = pgSchema("neon_auth").table("user", {
  id: uuid("id").primaryKey(),
});

export const questions = pgTable(
  "questions",
  {
    id: cuidPrimaryKey(),
    specialty_id: text().notNull(),
    section_id: text().notNull(),
    number: integer().notNull(),
    stem: text().notNull(),
    options: json().$type<QuestionOption[]>().notNull().default(sql`'[]'::json`),
    sources: json().$type<QuestionSource[]>().notNull().default(sql`'[]'::json`),
    correct_option_id: text().notNull(),
    explanation: text().notNull(),
    note: text(),
    shuffle: boolean().notNull().default(true),
    status: text({ enum: questionStatuses }).notNull().default("draft"),
    review_comment: text(),
    version: integer().notNull().default(1),
    updated_at: dateTime()
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
    reviewed_by: uuid("reviewed_by").notNull(),
    reviewed_at: dateTime(),
  },
  (table) => [
    foreignKey({
      name: "questions_specialty_id_fkey",
      columns: [table.specialty_id],
      foreignColumns: [specialties.id],
    }),
    foreignKey({
      name: "questions_section_id_fkey",
      columns: [table.section_id],
      foreignColumns: [sections.id],
    }),
    foreignKey({
      name: "questions_reviewed_by_fkey",
      columns: [table.reviewed_by],
      foreignColumns: [neonAuthUsers.id],
    }),
    index("questions_specialty_id_idx_04170370").on(table.specialty_id),
    index("questions_specialty_id_status_number_idx_48ef38b1").on(table.specialty_id, table.status, table.number),
    index("questions_section_id_idx_13db6de7").on(table.section_id),
    index("questions_section_id_status_idx_a0e1b6e6").on(table.section_id, table.status),
    index("questions_status_updated_at_idx_b01876cb").on(table.status, table.updated_at),
    index("questions_reviewed_by_idx_ef840284").on(table.reviewed_by),
  ],
);

export const entitlements = pgTable(
  "entitlements",
  {
    id: cuidPrimaryKey(),
    user_id: uuid("user_id").notNull(),
    // A null specialty_id grants access to all specialties.
    specialty_id: text(),
    source: text({ enum: entitlementSources }).notNull(),
    source_ref: text().notNull(),
    starts_at: dateTime().notNull().defaultNow(),
    ends_at: dateTime(),
  },
  (table) => [
    foreignKey({
      name: "entitlements_user_id_fkey",
      columns: [table.user_id],
      foreignColumns: [neonAuthUsers.id],
    }),
    foreignKey({
      name: "entitlements_specialty_id_fkey",
      columns: [table.specialty_id],
      foreignColumns: [specialties.id],
    }),
    index("entitlements_user_id_idx_6c952402").on(table.user_id),
    index("entitlements_user_id_specialty_id_ends_at_idx_1e5b227f").on(table.user_id, table.specialty_id, table.ends_at),
    index("entitlements_specialty_id_idx_04170370").on(table.specialty_id),
    index("entitlements_source_source_ref_idx_5f6ab958").on(table.source, table.source_ref),
  ],
);

export const examSessions = pgTable(
  "exam_sessions",
  {
    id: cuidPrimaryKey(),
    user_id: uuid("user_id").notNull(),
    specialty_id: text().notNull(),
    question_ids: text().array().notNull().default(sql`'{}'::text[]`),
    started_at: dateTime().notNull().defaultNow(),
    finished_at: dateTime(),
    // Time limit in seconds.
    duration_limit: integer().notNull(),
    // Final score as a percentage from 0 to 100.
    score: doublePrecision(),
    passed: boolean(),
  },
  (table) => [
    foreignKey({
      name: "exam_sessions_user_id_fkey",
      columns: [table.user_id],
      foreignColumns: [neonAuthUsers.id],
    }),
    foreignKey({
      name: "exam_sessions_specialty_id_fkey",
      columns: [table.specialty_id],
      foreignColumns: [specialties.id],
    }),
    index("exam_sessions_user_id_idx_6c952402").on(table.user_id),
    index("exam_sessions_user_id_started_at_idx_beb66913").on(table.user_id, table.started_at),
    index("exam_sessions_specialty_id_idx_04170370").on(table.specialty_id),
    check("exam_sessions_question_ids_no_nulls", sql`array_position(${table.question_ids}, NULL) IS NULL`),
  ],
);

export const answers = pgTable(
  "answers",
  {
    id: cuidPrimaryKey(),
    user_id: uuid("user_id").notNull(),
    question_id: text().notNull(),
    question_version: integer().notNull(),
    selected_option_id: text().notNull(),
    is_correct: boolean().notNull(),
    mode: text({ enum: answerModes }).notNull(),
    answered_at: dateTime().notNull().defaultNow(),
    exam_session_id: text(),
  },
  (table) => [
    foreignKey({
      name: "answers_user_id_fkey",
      columns: [table.user_id],
      foreignColumns: [neonAuthUsers.id],
    }),
    foreignKey({
      name: "answers_question_id_fkey",
      columns: [table.question_id],
      foreignColumns: [questions.id],
    }),
    foreignKey({
      name: "answers_exam_session_id_fkey",
      columns: [table.exam_session_id],
      foreignColumns: [examSessions.id],
    }),
    index("answers_user_id_idx_6c952402").on(table.user_id),
    index("answers_user_id_answered_at_idx_7771bd3c").on(table.user_id, table.answered_at),
    index("answers_user_id_question_id_answered_at_idx_faa91429").on(table.user_id, table.question_id, table.answered_at),
    index("answers_question_id_idx_fcfb223c").on(table.question_id),
    index("answers_exam_session_id_idx_d2694f5f").on(table.exam_session_id),
  ],
);

export const reviewQueue = pgTable(
  "review_queue",
  {
    user_id: uuid("user_id").notNull(),
    question_id: text().notNull(),
    stage: integer().notNull().default(0),
    next_review_at: dateTime().notNull(),
  },
  (table) => [
    primaryKey({ name: "review_queue_pkey", columns: [table.user_id, table.question_id] }),
    foreignKey({
      name: "review_queue_user_id_fkey",
      columns: [table.user_id],
      foreignColumns: [neonAuthUsers.id],
    }),
    foreignKey({
      name: "review_queue_question_id_fkey",
      columns: [table.question_id],
      foreignColumns: [questions.id],
    }),
    index("review_queue_user_id_idx_6c952402").on(table.user_id),
    index("review_queue_user_id_next_review_at_idx_8ea0b1b0").on(table.user_id, table.next_review_at),
    index("review_queue_question_id_idx_fcfb223c").on(table.question_id),
  ],
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    user_id: uuid("user_id").notNull(),
    question_id: text().notNull(),
    created_at: dateTime().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ name: "bookmarks_pkey", columns: [table.user_id, table.question_id] }),
    foreignKey({
      name: "bookmarks_user_id_fkey",
      columns: [table.user_id],
      foreignColumns: [neonAuthUsers.id],
    }),
    foreignKey({
      name: "bookmarks_question_id_fkey",
      columns: [table.question_id],
      foreignColumns: [questions.id],
    }),
    index("bookmarks_user_id_idx_6c952402").on(table.user_id),
    index("bookmarks_user_id_created_at_idx_b562028f").on(table.user_id, table.created_at),
    index("bookmarks_question_id_idx_fcfb223c").on(table.question_id),
  ],
);

export const errorReports = pgTable(
  "error_reports",
  {
    id: cuidPrimaryKey(),
    user_id: uuid("user_id").notNull(),
    question_id: text().notNull(),
    type: text().notNull(),
    text: text().notNull(),
    status: text({ enum: errorReportStatuses }).notNull().default("new"),
    created_at: dateTime().notNull().defaultNow(),
    resolved_at: dateTime(),
  },
  (table) => [
    foreignKey({
      name: "error_reports_user_id_fkey",
      columns: [table.user_id],
      foreignColumns: [neonAuthUsers.id],
    }),
    foreignKey({
      name: "error_reports_question_id_fkey",
      columns: [table.question_id],
      foreignColumns: [questions.id],
    }),
    index("error_reports_status_created_at_idx_1bbe8adf").on(table.status, table.created_at),
    index("error_reports_question_id_idx_fcfb223c").on(table.question_id),
    index("error_reports_user_id_idx_6c952402").on(table.user_id),
  ],
);

export const codeBatches = pgTable(
  "code_batches",
  {
    id: cuidPrimaryKey(),
    sponsor_id: text(),
    duration_days: integer().notNull(),
    expires_at: dateTime().notNull(),
    type: text({ enum: codeBatchTypes }).notNull(),
    // Usage limit for each code in this batch.
    max_uses: integer().notNull().default(1),
  },
  (table) => [
    foreignKey({
      name: "code_batches_sponsor_id_fkey",
      columns: [table.sponsor_id],
      foreignColumns: [sponsors.id],
    }),
    index("code_batches_sponsor_id_idx_5dec6ff5").on(table.sponsor_id),
    index("code_batches_expires_at_idx_35365ada").on(table.expires_at),
  ],
);

export const codes = pgTable(
  "codes",
  {
    id: cuidPrimaryKey(),
    batch_id: text().notNull(),
    code: text().notNull().unique("codes_code_key"),
    uses: integer().notNull().default(0),
    created_at: dateTime().notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "codes_batch_id_fkey",
      columns: [table.batch_id],
      foreignColumns: [codeBatches.id],
    }),
    index("codes_batch_id_idx_49ba28fa").on(table.batch_id),
  ],
);

export const calculators = pgTable(
  "calculators",
  {
    id: cuidPrimaryKey(),
    slug: text().notNull().unique("calculators_slug_key"),
    name_hy: text().notNull(),
    config: json().notNull(),
    source: text().notNull(),
    is_published: boolean().notNull().default(false),
  },
  (table) => [
    index("calculators_is_published_idx_524f5def").on(table.is_published),
  ],
);

export const questionTopics = pgTable(
  "question_topics",
  {
    question_id: text().notNull(),
    topic_id: text().notNull(),
  },
  (table) => [
    primaryKey({ name: "question_topics_pkey", columns: [table.question_id, table.topic_id] }),
    foreignKey({
      name: "question_topics_question_id_fkey",
      columns: [table.question_id],
      foreignColumns: [questions.id],
    }),
    foreignKey({
      name: "question_topics_topic_id_fkey",
      columns: [table.topic_id],
      foreignColumns: [topics.id],
    }),
    index("question_topics_question_id_idx_fcfb223c").on(table.question_id),
    index("question_topics_topic_id_idx_334b0e8b").on(table.topic_id),
  ],
);

export const codeBatchSpecialties = pgTable(
  "code_batch_specialties",
  {
    batch_id: text().notNull(),
    specialty_id: text().notNull(),
  },
  (table) => [
    primaryKey({ name: "code_batch_specialties_pkey", columns: [table.batch_id, table.specialty_id] }),
    foreignKey({
      name: "code_batch_specialties_batch_id_fkey",
      columns: [table.batch_id],
      foreignColumns: [codeBatches.id],
    }),
    foreignKey({
      name: "code_batch_specialties_specialty_id_fkey",
      columns: [table.specialty_id],
      foreignColumns: [specialties.id],
    }),
    index("code_batch_specialties_batch_id_idx_49ba28fa").on(table.batch_id),
    index("code_batch_specialties_specialty_id_idx_04170370").on(table.specialty_id),
  ],
);

export const organizationAdmins = pgTable(
  "organization_admins",
  {
    organization_id: text().notNull(),
    user_id: uuid("user_id").notNull(),
  },
  (table) => [
    primaryKey({ name: "organization_admins_pkey", columns: [table.organization_id, table.user_id] }),
    foreignKey({
      name: "organization_admins_organization_id_fkey",
      columns: [table.organization_id],
      foreignColumns: [organizations.id],
    }),
    foreignKey({
      name: "organization_admins_user_id_fkey",
      columns: [table.user_id],
      foreignColumns: [neonAuthUsers.id],
    }),
    index("organization_admins_organization_id_idx_1a5cd3f5").on(table.organization_id),
    index("organization_admins_user_id_idx_6c952402").on(table.user_id),
  ],
);
export const resources = pgTable("resources", {
  id: cuidPrimaryKey(),
  title: text().notNull(),
  url: text().notNull(),
  description: text(),
  is_published: boolean().notNull().default(false),
});

export type Resource = typeof resources.$inferSelect;
export type Specialty = typeof specialties.$inferSelect;
export type NewSpecialty = typeof specialties.$inferInsert;
export type Section = typeof sections.$inferSelect
export type Topic = typeof topics.$inferSelect;