"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import HeadingActions from "@/components/admin/header-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth/client";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role?: string | null;
  banned?: boolean | null;
  createdAt: Date;
};

const roleLabels: Record<string, string> = {
  user: "Օգտատեր",
  content_editor: "Բովանդակության խմբագիր",
  reviewer: "Վերանայող",
  admin: "Ադմինիստրատոր",
};

export default function UsersContent() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(async (searchValue?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: 50,
          offset: 0,
          searchValue: searchValue?.trim() || undefined,
          searchField: "email",
          searchOperator: "contains",
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (error) {
        toast.error(error.message || "Չհաջողվեց բեռնել օգտատերերին։");
        return;
      }

      setUsers(data?.users ?? []);
    } catch {
      toast.error("Չհաջողվեց բեռնել օգտատերերին։");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  return (
    <div className="space-y-3">
      <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">
        Օգտատերեր
      </h1>

      <HeadingActions
        search={search}
        onSearchChange={setSearch}
      />

      <div className="overflow-hidden rounded-md border bg-card/60 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Անուն</TableHead>
              <TableHead>Էլ․ փոստ</TableHead>
              <TableHead>Դեր</TableHead>
              <TableHead>Կարգավիճակ</TableHead>
              <TableHead>Ստեղծվել է</TableHead>
              <TableHead className="text-right">Գործողություններ</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Բեռնվում են օգտատերերը…
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Օգտատերեր չկան։
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <p>{user.email}</p>

                      {user.emailVerified && (
                        <Badge variant="outline">Հաստատված</Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(user.role ?? "user")
                        .split(",")
                        .map((role) => role.trim())
                        .filter(Boolean)
                        .map((role) => (
                          <Badge key={role} variant="secondary">
                            {roleLabels[role] ?? role}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    {user.banned ? (
                      <Badge variant="destructive">Արգելափակված</Badge>
                    ) : (
                      <Badge variant="outline">Ակտիվ</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("hy-AM")}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${user.id}`}>
                        Բացել
                        <ExternalLink />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}