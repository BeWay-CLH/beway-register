"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, LogOut, Trash2 } from "lucide-react";
import { exportMyData, exportCvPdf, deleteMyAccount, logout } from "@/app/cuenta/actions";
import { Button } from "@/components/ui/Button";

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function base64ToBlob(base64: string, type: string) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return new Blob([bytes], { type });
}

export function CuentaActions() {
  const router = useRouter();
  const [isExporting, startExport] = useTransition();
  const [isExportingPdf, startExportPdf] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [isLoggingOut, startLogout] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleExport() {
    setError(null);
    startExport(async () => {
      const result = await exportMyData();
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
      downloadBlob(blob, `beway-cv-vivo-${new Date().toISOString().slice(0, 10)}.json`);
    });
  }

  function handleExportPdf() {
    setError(null);
    startExportPdf(async () => {
      const result = await exportCvPdf();
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      downloadBlob(base64ToBlob(result.pdfBase64, "application/pdf"), result.fileName);
    });
  }

  function handleDelete() {
    if (!window.confirm("¿Eliminar tu cuenta y todos tus datos de BeWay? Esta acción no se puede deshacer.")) return;
    setError(null);
    startDelete(async () => {
      const result = await deleteMyAccount();
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  function handleLogout() {
    startLogout(async () => {
      await logout();
    });
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Button variant="outline" icon={FileText} onClick={handleExportPdf} loading={isExportingPdf} fullWidth>
        Descargar mi CV en PDF
      </Button>
      <Button variant="outline" icon={Download} onClick={handleExport} loading={isExporting} fullWidth>
        Exportar mis datos
      </Button>
      <Button variant="outline" icon={LogOut} onClick={handleLogout} loading={isLoggingOut} fullWidth>
        Cerrar sesión
      </Button>
      <Button
        variant="outline"
        icon={Trash2}
        onClick={handleDelete}
        loading={isDeleting}
        fullWidth
        className="border-status-danger text-status-danger hover:bg-status-danger/10"
      >
        Eliminar mi cuenta
      </Button>

      {error && (
        <p role="alert" className="font-body text-small text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}
