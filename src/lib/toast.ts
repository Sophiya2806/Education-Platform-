// Lightweight wrapper around the global toast store.
import { useApp } from "@/store";

export function toast(title: string, variant: "success" | "info" | "achievement" = "success", description?: string) {
  useApp.getState().pushToast({ title, description, variant });
}
