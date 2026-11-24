"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Download, Plus, Search, Upload } from "lucide-react";
import Link from "next/link";

interface HeadingActionsProps {
  href?: string;
  onCreate?: () => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  resultCount?: number;
  cols?: string[];
  onExport?: (cols?: string[]) => void;
  onImport?: (cols?: string[]) => void;
  placeholder?: string
}

export default function HeadingActions({
  href,
  onCreate,
  search = "",
  onSearchChange,
  resultCount,
  cols,
  onExport,
  onImport,
  placeholder = "Որոնում"
}: HeadingActionsProps) {
  const canCreate = Boolean(href?.trim()) || Boolean(onCreate);

  const canImport = Boolean(onImport);
  const canExport = Boolean(onExport);

  return (
    <div className="flex items-center justify-between gap-2">
      <InputGroup className="bg-background/50 max-w-lg">
        <InputGroupInput
          type="search"
          placeholder={placeholder}
          value={search}
          onChange={(event) => onSearchChange?.(event.target.value)}
        />

        <InputGroupAddon>
          <Search />
        </InputGroupAddon>

        {typeof resultCount === "number" && (
          <InputGroupAddon align="inline-end">
            {resultCount} արդյունք
          </InputGroupAddon>
        )}
      </InputGroup>

      <div className="flex flex-wrap items-center gap-2">
        {canCreate &&
          (href?.trim() ? (
            <Button variant="outline" asChild>
              <Link href={href}>
                <Plus />
                Ստեղծել
              </Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onCreate}>
              <Plus />
              Ստեղծել
            </Button>
          ))}

        {(canImport || canExport) && (
          <ButtonGroup>
            <Button
              type="button"
              size="icon"
              variant="outline"
              title="Ներմուծել"
              aria-label="Ներմուծել"
              disabled={!canImport}
              onClick={() => onImport?.(cols)}
            >
              <Upload />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="outline"
              title="Արտածել"
              aria-label="Արտածել"
              disabled={!canExport}
              onClick={() => onExport?.(cols)}
            >
              <Download />
            </Button>
          </ButtonGroup>
        )}
      </div>
    </div>
  );
}