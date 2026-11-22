import type * as z from "zod";
import type { questionSchema, resourceSchema, sectionSchema, specialtySchema, topicSchema } from "../schemas";
import type { passwordSchema, profileSchema, registerSchema, loginSchema, passwordResetRequestSchema, newPasswordSchema } from "../schemas/auth";

export type SpecialtyFormValues = z.input<typeof specialtySchema>;
export type SpecialtyFormData = z.output<typeof specialtySchema>;

export type QuestionFormValues = z.infer<typeof questionSchema>;
export type ResourceFormValues = z.infer<typeof resourceSchema>;
export type SectionFormValues = z.infer<typeof sectionSchema>;
export type TopicFormValues = z.infer<typeof topicSchema>;

export type PasswordValues = z.infer<typeof passwordSchema>
export type ProfileValues = z.infer<typeof profileSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type PasswordResetRequestFormValues = z.infer<typeof passwordResetRequestSchema>;
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;