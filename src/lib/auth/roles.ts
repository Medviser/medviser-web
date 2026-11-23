// src/lib/auth/permissions.ts

import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,

  question: [
    "create",
    "read",
    "update",
    "delete",
    "review",
    "publish",
  ],

  report: [
    "read",
    "accept",
    "reject",
    "resolve",
  ],
} as const;

export const ac =
  createAccessControl(statement);

export const user = ac.newRole({
  question: ["read"],
});

export const contentEditor = ac.newRole({
  question: [
    "create",
    "read",
    "update",
  ],
  report: ["read"],
});

export const reviewer = ac.newRole({
  question: [
    "read",
    "review",
    "publish",
  ],
  report: [
    "read",
    "accept",
    "reject",
    "resolve",
  ],
});

export const admin = ac.newRole({
  ...adminAc.statements,

  question: [
    "create",
    "read",
    "update",
    "delete",
    "review",
    "publish",
  ],

  report: [
    "read",
    "accept",
    "reject",
    "resolve",
  ],
});