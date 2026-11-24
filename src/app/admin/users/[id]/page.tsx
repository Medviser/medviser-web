import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import UserInfoContent from "./content";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserInfoPage({ params }: Props) {
  const { id } = await params;

  const user = await auth.api.getUser({
    query: {
      id,
    },
    headers: await headers(),
  });

  if (!user) {
    notFound();
  }

  return <UserInfoContent data={user} />;
}