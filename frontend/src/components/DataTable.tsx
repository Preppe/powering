import type { ReactNode } from "react";
import { ApiError } from "#/lib/api/client";
import { PaginationControls } from "#/components/PaginationControls";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  skeletonWidth?: string;
  skeletonRounded?: string;
}

interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  meta?: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  emptyIcon: string;
  emptyMessage: string;
  entityLabel: string;
  page: number;
  onPageChange: (p: number) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  isDeleting: (item: T) => boolean;
  getId: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  meta,
  isLoading,
  isError,
  error,
  onRetry,
  emptyIcon,
  emptyMessage,
  entityLabel,
  page,
  onPageChange,
  onEdit,
  onDelete,
  isDeleting,
  getId,
}: DataTableProps<T>) {
  const totalPages = meta?.totalPages ?? 1;
  const colSpan = columns.length + 1; // +1 for action column
  const from = meta ? (meta.currentPage - 1) * meta.itemsPerPage + 1 : 0;
  const to = meta ? Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems) : 0;

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden">
      <Table className="text-left border-collapse [&_div]:overflow-visible">
        <TableHeader>
          <TableRow className="bg-surface-container-high/50 border-b-0 hover:bg-surface-container-high/50">
            {columns.map((col) => (
              <TableHead key={col.key} className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">
                {col.header}
              </TableHead>
            ))}
            <TableHead className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-0">
          {isLoading ? (
            <SkeletonRows columns={columns} />
          ) : isError ? (
            <tr>
              <td colSpan={colSpan} className="px-8 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-error">error</span>
                  <p className="text-sm text-on-surface-variant">{error instanceof ApiError ? error.message : "Errore nel caricamento"}</p>
                  <button onClick={onRetry} className="px-4 py-2 text-sm font-semibold text-primary hover:underline">
                    Riprova
                  </button>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="px-8 py-16 text-center">
                <span className="material-symbols-outlined text-4xl text-outline mb-3 block">{emptyIcon}</span>
                <p className="text-on-surface-variant text-sm">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <DataRow
                key={getId(item)}
                item={item}
                index={index}
                columns={columns}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
                isDeleting={isDeleting(item)}
              />
            ))
          )}
        </TableBody>
      </Table>

      {!isLoading && !isError && data.length > 0 && (
        <div className="bg-surface-container-lowest px-8 py-6 flex justify-between items-center">
          <p className="text-sm text-on-surface-variant">
            Mostrando{" "}
            <span className="font-bold">
              {from}–{to}
            </span>{" "}
            di <span className="font-bold">{meta?.totalItems ?? 0}</span> {entityLabel}
          </p>
          <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}

function DataRow<T>({
  item,
  index,
  columns,
  onEdit,
  onDelete,
  isDeleting,
}: {
  item: T;
  index: number;
  columns: Column<T>[];
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <TableRow
      className={`${
        index % 2 === 0 ? "bg-surface-container-lowest hover:bg-surface border-b-0" : "bg-surface hover:bg-surface-container-high/30 border-b-0"
      } group`}
    >
      {columns.map((col) => (
        <TableCell key={col.key} className="px-8 py-6">
          {col.render(item)}
        </TableCell>
      ))}
      <TableCell className="px-8 py-6 text-right space-x-2">
        <button onClick={onEdit} className="p-2 hover:bg-primary-fixed rounded-lg text-primary transition-all" title="Modifica">
          <span className="material-symbols-outlined text-xl">edit</span>
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 hover:bg-error-container rounded-lg text-error transition-all disabled:opacity-50"
          title="Elimina"
        >
          <span className="material-symbols-outlined text-xl">{isDeleting ? "progress_activity" : "delete"}</span>
        </button>
      </TableCell>
    </TableRow>
  );
}

function SkeletonRows<T>({ columns }: { columns: Column<T>[] }) {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i} className="border-b-0">
          {columns.map((col) => (
            <TableCell key={col.key} className="px-8 py-6">
              <div className={`h-4 ${col.skeletonWidth ?? "w-24"} ${col.skeletonRounded ?? "rounded"} bg-surface-container animate-pulse`} />
            </TableCell>
          ))}
          <TableCell className="px-8 py-6">
            <div className="h-8 w-16 ml-auto rounded bg-surface-container animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
