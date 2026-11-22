"use client";
import { authClient } from "@/lib/auth/client";
import { PasswordSettings } from "./password";
import ProfileSettings from "./profile";
import { SessionSettings } from "./session";
import { LinkedAccounts } from "./account-link";
import { DeleteAccount } from "./delete-account";

const sectionClassName =
  "space-y-4 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm";

export default function AccountSettings() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <section aria-label="Հաշվի կարգավորումներ" className={sectionClassName}>
        <output className="block text-sm text-muted-foreground">
          Բեռնվում են հաշվի տվյալները…
        </output>
      </section>
    );
  }

  const user = session?.user;

  if (error || !user) {
    return (
      <section aria-label="Հաշվի կարգավորումներ" className={sectionClassName}>
        <output className="block text-sm text-muted-foreground">
          Չհաջողվեց բեռնել հաշվի տվյալները։
        </output>
      </section>
    );
  }

  return (
    <div key={user.id} className="grid items-start gap-3 md:grid-cols-2">
      <div className="space-y-3">
        <ProfileSettings
          name={user.name.trim()}
          email={user.email}
          emailVerified={user.emailVerified}
          image={user.image}
        />

        <SessionSettings />
        <LinkedAccounts />
      </div>

      <div className="space-y-3">
        <PasswordSettings />
        <DeleteAccount />
      </div>
    </div>
  );
}
