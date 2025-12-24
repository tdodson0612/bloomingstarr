// src/components/DataTableServer.tsx
"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "./DataTable";

interface DataTableServerProps {
  slug: string;
  data: Record<string, any>[];
  canEdit: boolean;
  addRoute?: string;
  editRoute?: string;
}

export function DataTableServer({
  slug,
  data,
  canEdit,
  addRoute,
  editRoute,
}: DataTableServerProps) {
  const router = useRouter();

  const handleAdd = addRoute
    ? () => router.push(addRoute)
    : undefined;

  const handleEdit = editRoute
    ? (id: string) => router.push(`${editRoute}/${id}/edit`)
    : undefined;

  const handleDelete = async (id: string) => {
    // This will be handled by the existing delete server actions
    // For now, just refresh the page
    router.refresh();
  };

  return (
    <DataTable
      slug={slug}
      data={data}
      canEdit={canEdit}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}