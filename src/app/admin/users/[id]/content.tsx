"use client";

import Link from "next/link";
import { useState } from "react";
import { Ban, ChevronLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth/client";
import { getInitialsFromName } from "@/lib/utils";
import useCurrentUser from "@/hooks/use-current-user";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  createdAt: Date;

  specialtyId?: string | null;
  professionalStatus?: string | null;
  workplace?: string | null;
  hcpVerified?: string | null;
  organizationId?: string | null;
  registryNumber?: string | null;
};

interface UserInfoContentProps {
  data: AdminUser;
}

const roleLabels = {
  user: "Օգտատեր",
  content_editor: "Բովանդակության խմբագիր",
  reviewer: "Վերանայող",
  admin: "Ադմինիստրատոր",
} as const;

type RoleType = keyof typeof roleLabels;

const hcpLabels: Record<string, string> = {
  none: "Չստուգված",
  self_declared: "Ինքնահայտարարված",
  verified: "Հաստատված",
};

function isRoleType(value: string | null | undefined): value is RoleType {
  return Boolean(value && value in roleLabels);
}

export default function UserInfoContent({ data }: UserInfoContentProps) {
  const currUser = useCurrentUser();
  const [role, setRole] = useState<RoleType>(isRoleType(data.role) ? data.role : "user",);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  async function updateRole(value: RoleType) {
    setIsUpdatingRole(true);

    try {
      const { error } = await authClient.admin.setRole({
        userId: data.id,
        role: value,
      });

      if (error) {
        toast.error(error.message || "Չհաջողվեց փոխել օգտատիրոջ դերը։");
        return;
      }

      setRole(value);

      toast.success("Օգտատիրոջ դերը փոխվեց։");
    } catch {
      toast.error("Չհաջողվեց փոխել օգտատիրոջ դերը։");
    } finally {
      setIsUpdatingRole(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
            Օգտատիրոջ տվյալներ
          </h1>

          <p className="text-sm text-muted-foreground">
            ID՝ <span className="font-mono">{data.id}</span>
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/users">
            <ChevronLeft />
            Վերադառնալ
          </Link>
        </Button>
      </div>

      <section className="space-y-4 rounded-md border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={data.image ?? undefined} alt="" />

            <AvatarFallback>
              {data.name ? getInitialsFromName(data.name).slice(0, 2) : "?"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <h2 className="font-semibold text-lg">{data.name}</h2>

              <p className="wrap-break-word text-sm text-muted-foreground">
                {data.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.emailVerified && (
                <Badge variant="outline">
                  <MailCheck />
                  Հաստատված էլ․ փոստ
                </Badge>
              )}

              {data.banned ? (
                <Badge variant="destructive">
                  <Ban />
                  Արգելափակված
                </Badge>
              ) : (
                <Badge variant="outline">Ակտիվ</Badge>
              )}
            </div>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Դեր</dt>

            <dd>
              <Badge variant="secondary">{roleLabels[role] ?? role}</Badge>
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">
              Մասնագիտական կարգավիճակ
            </dt>

            <dd className="text-sm">{data.professionalStatus ?? "Նշված չէ"}</dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">HCP հաստատում</dt>

            <dd className="text-sm">
              {data.hcpVerified
                ? (hcpLabels[data.hcpVerified] ?? data.hcpVerified)
                : "Չստուգված"}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Մասնագիտության ID</dt>

            <dd className="wrap-break-word font-mono text-sm">
              {data.specialtyId ?? "Չկա"}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">
              Կազմակերպության ID
            </dt>

            <dd className="wrap-break-word font-mono text-sm">
              {data.organizationId ?? "Չկա"}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Աշխատավայր</dt>

            <dd className="text-sm">{data.workplace ?? "Նշված չէ"}</dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">
              Գրանցամատյանի համար
            </dt>

            <dd className="wrap-break-word text-sm">
              {data.registryNumber ?? "Չկա"}
            </dd>
          </div>

          <div className="space-y-1 rounded-md border p-3">
            <dt className="text-xs text-muted-foreground">Ստեղծվել է</dt>

            <dd className="text-sm">
              {new Date(data.createdAt).toLocaleString("hy-AM")}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4 rounded-md border bg-card/60 p-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="font-semibold">Դերի կառավարում</h2>

          <p className="text-sm text-muted-foreground">
            Փոխեք օգտատիրոջ հասանելիության մակարդակը։
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={role}
            onValueChange={updateRole}
            disabled={isUpdatingRole || currUser?.id===data.id}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="user">Օգտատեր</SelectItem>

              <SelectItem value="content_editor">
                Բովանդակության խմբագիր
              </SelectItem>

              <SelectItem value="reviewer">Վերանայող</SelectItem>

              <SelectItem value="admin">Ադմինիստրատոր</SelectItem>
            </SelectContent>
          </Select>

          {isUpdatingRole && (
            <span className="text-sm text-muted-foreground">Պահպանվում է…</span>
          )}
        </div>
      </section>
    </div>
  );
}
