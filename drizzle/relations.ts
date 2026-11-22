import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id
		}),
	},
	user: {
		accounts: r.many.account(),
		answers: r.many.answers(),
		questionsViaBookmarks: r.many.questions({
			alias: "questions_id_user_id_via_bookmarks"
		}),
		bookmarks: r.many.bookmarks(),
		specialtiesViaEntitlements: r.many.specialties({
			alias: "specialties_id_user_id_via_entitlements"
		}),
		entitlements: r.one.entitlements(),
		questionsViaErrorReports: r.many.questions({
			alias: "questions_id_user_id_via_errorReports"
		}),
		errorReports: r.many.errorReports(),
		specialtiesViaExamSessions: r.many.specialties({
			alias: "specialties_id_user_id_via_examSessions"
		}),
		examSessions: r.many.examSessions(),
		organizations: r.many.organizations(),
		organizationAdmins: r.many.organizationAdmins(),
		questionsReviewedBy: r.many.questions({
			alias: "questions_reviewedBy_user_id"
		}),
		questionsViaReviewQueue: r.many.questions({
			alias: "questions_id_user_id_via_reviewQueue"
		}),
		reviewQueues: r.many.reviewQueue(),
		sessions: r.many.session(),
	},
	answers: {
		examSession: r.one.examSessions({
			from: r.answers.examSessionId,
			to: r.examSessions.id
		}),
		question: r.one.questions({
			from: r.answers.questionId,
			to: r.questions.id
		}),
		user: r.one.user({
			from: r.answers.userId,
			to: r.user.id
		}),
	},
	examSessions: {
		answers: r.many.answers(),
		specialty: r.one.specialties({
			from: r.examSessions.specialtyId,
			to: r.specialties.id
		}),
		user: r.one.user({
			from: r.examSessions.userId,
			to: r.user.id
		}),
	},
	questions: {
		answers: r.many.answers(),
		usersViaBookmarks: r.many.user({
			from: r.questions.id.through(r.bookmarks.questionId),
			to: r.user.id.through(r.bookmarks.userId),
			alias: "questions_id_user_id_via_bookmarks"
		}),
		bookmarks: r.many.bookmarks(),
		usersViaErrorReports: r.many.user({
			from: r.questions.id.through(r.errorReports.questionId),
			to: r.user.id.through(r.errorReports.userId),
			alias: "questions_id_user_id_via_errorReports"
		}),
		errorReports: r.many.errorReports(),
		topics: r.many.topics({
			from: r.questions.id.through(r.questionTopics.questionId),
			to: r.topics.id.through(r.questionTopics.topicId)
		}),
		questionTopics: r.many.questionTopics(),
		user: r.one.user({
			from: r.questions.reviewedBy,
			to: r.user.id,
			alias: "questions_reviewedBy_user_id"
		}),
		section: r.one.sections({
			from: r.questions.sectionId,
			to: r.sections.id
		}),
		specialty: r.one.specialties({
			from: r.questions.specialtyId,
			to: r.specialties.id
		}),
		usersViaReviewQueue: r.many.user({
			from: r.questions.id.through(r.reviewQueue.questionId),
			to: r.user.id.through(r.reviewQueue.userId),
			alias: "questions_id_user_id_via_reviewQueue"
		}),
		reviewQueues: r.many.reviewQueue(),
	},
	bookmarks: {
		question: r.one.questions({
			from: r.bookmarks.questionId,
			to: r.questions.id
		}),
		user: r.one.user({
			from: r.bookmarks.userId,
			to: r.user.id
		}),
	},
	codeBatches: {
		specialties: r.many.specialties({
			from: r.codeBatches.id.through(r.codeBatchSpecialties.batchId),
			to: r.specialties.id.through(r.codeBatchSpecialties.specialtyId)
		}),
		codeBatchSpecialties: r.many.codeBatchSpecialties(),
		sponsor: r.one.sponsors({
			from: r.codeBatches.sponsorId,
			to: r.sponsors.id
		}),
		codes: r.many.codes(),
	},
	specialties: {
		codeBatches: r.many.codeBatches(),
		codeBatchSpecialties: r.many.codeBatchSpecialties(),
		usersViaEntitlements: r.many.user({
			from: r.specialties.id.through(r.entitlements.specialtyId),
			to: r.user.id.through(r.entitlements.userId),
			alias: "specialties_id_user_id_via_entitlements"
		}),
		entitlements: r.many.entitlements(),
		usersViaExamSessions: r.many.user({
			from: r.specialties.id.through(r.examSessions.specialtyId),
			to: r.user.id.through(r.examSessions.userId),
			alias: "specialties_id_user_id_via_examSessions"
		}),
		examSessions: r.many.examSessions(),
		questions: r.many.questions(),
		sections: r.many.sections(),
		sponsor: r.one.sponsors({
			from: r.specialties.sponsorId,
			to: r.sponsors.id
		}),
		topics: r.many.topics(),
	},
	codeBatchSpecialties: {
		codeBatch: r.one.codeBatches({
			from: r.codeBatchSpecialties.batchId,
			to: r.codeBatches.id
		}),
		specialty: r.one.specialties({
			from: r.codeBatchSpecialties.specialtyId,
			to: r.specialties.id
		}),
	},
	sponsors: {
		codeBatches: r.many.codeBatches(),
		specialties: r.many.specialties(),
	},
	codes: {
		codeBatch: r.one.codeBatches({
			from: r.codes.batchId,
			to: r.codeBatches.id
		}),
	},
	entitlements: {
		specialty: r.one.specialties({
			from: r.entitlements.specialtyId,
			to: r.specialties.id
		}),
		user: r.one.user({
			from: r.entitlements.userId,
			to: r.user.id
		}),
	},
	errorReports: {
		question: r.one.questions({
			from: r.errorReports.questionId,
			to: r.questions.id
		}),
		user: r.one.user({
			from: r.errorReports.userId,
			to: r.user.id
		}),
	},
	organizations: {
		users: r.many.user({
			from: r.organizations.id.through(r.organizationAdmins.organizationId),
			to: r.user.id.through(r.organizationAdmins.userId)
		}),
		organizationAdmins: r.many.organizationAdmins(),
	},
	organizationAdmins: {
		organization: r.one.organizations({
			from: r.organizationAdmins.organizationId,
			to: r.organizations.id
		}),
		user: r.one.user({
			from: r.organizationAdmins.userId,
			to: r.user.id
		}),
	},
	topics: {
		questions: r.many.questions(),
		questionTopics: r.many.questionTopics(),
		specialty: r.one.specialties({
			from: r.topics.specialtyId,
			to: r.specialties.id
		}),
	},
	questionTopics: {
		question: r.one.questions({
			from: r.questionTopics.questionId,
			to: r.questions.id
		}),
		topic: r.one.topics({
			from: r.questionTopics.topicId,
			to: r.topics.id
		}),
	},
	sections: {
		questions: r.many.questions(),
		specialty: r.one.specialties({
			from: r.sections.specialtyId,
			to: r.specialties.id
		}),
	},
	reviewQueue: {
		question: r.one.questions({
			from: r.reviewQueue.questionId,
			to: r.questions.id
		}),
		user: r.one.user({
			from: r.reviewQueue.userId,
			to: r.user.id
		}),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id
		}),
	},
}))