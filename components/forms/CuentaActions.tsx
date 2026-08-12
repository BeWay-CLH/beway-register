"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, LogOut, Trash2 } from "lucide-react";
import { exportMyData, deleteMyAccount, logout } from "@/app/cuenta/actions";
import { Button } from "@/components/ui/Button";

export function CuentaActions() {
  const router = useRouter();
  const [isExporting, startExport] = useTransition();
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
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `beway-cv-vivo-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
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
