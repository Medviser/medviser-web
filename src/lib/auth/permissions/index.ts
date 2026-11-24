import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  question: ["create","read","update","delete","review","publish","archive"],
  report: ["read","accept","reject","resolve","reopen"],
  userProfile: ["read","update","verify-hcp"],
  specialty: ["create","read","update","delete"],
  section: ["create","read","update","delete"],
  topic: ["create","read","update","delete"],
  organization: ["create","read","update","delete"],
  resource: ["create","read","update","delete","import","export"],
  dashboard: ["read"]
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  question: ["read"],
});

export const contentEditor = ac.newRole({
  dashboard: ["read"],
  question: ["create","read","update"],
  report: ["read"],
  specialty: ["read"],
  section: ["read"],
  topic: ["read"],
  resource: ["create","read","update","import","export"],
});

export const reviewer = ac.newRole({
  dashboard: ["read"],
  question: ["read","review","publish","archive"],
  report: ["read","accept","reject","resolve","reopen"],
  userProfile: ["read","verify-hcp"],
  specialty: ["read"],
  section: ["read"],
  topic: ["read"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  dashboard: ["read"],
  question: ["create","read","update","delete","review","publish","archive"],
  report: ["read","accept","reject","resolve","reopen"],
  userProfile: ["read","update","verify-hcp"],
  specialty: ["create","read","update","delete"],
  section: ["create","read","update","delete"],
  topic: ["create","read","update","delete"],
  organization: ["create","read","update","delete"],
  resource: ["create","read","update","delete","import","export"],
});