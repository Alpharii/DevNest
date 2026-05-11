import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  X, Plus, Globe, Lock, Users,
  Loader2, FolderKanban,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

interface CreateProjectProps {
  onClose: () => void;
  onCreateResult: (result: {
    success?: boolean;
    error?: string;
    message?: string;
  }) => void;
}

const projectSchema = z.object({
  actionType: z.string().min(1),
  title: z.string().min(6, "Judul minimal 6 karakter"),
  description: z.string().min(6, "Deskripsi minimal 6 karakter"),
  visibility: z.number(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const VISIBILITY_OPTIONS = [
  {
    value: 1,
    label: "Publik",
    description: "Semua orang bisa melihat proyek ini",
    icon: Globe,
  },
  {
    value: 2,
    label: "Privat",
    description: "Hanya anggota yang diundang",
    icon: Lock,
  },
];

export function CreateProjectModal({ onClose, onCreateResult }: CreateProjectProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      actionType: "createProject",
      title: "",
      description: "",
      visibility: 1,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectedVisibility = watch("visibility");

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Handle fetcher result
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    onCreateResult(fetcher.data as any);
    if ((fetcher.data as any)?.success) onClose();
  }, [fetcher.state, fetcher.data]);

  const onSubmit = (values: ProjectFormValues) => {
    const formData = new FormData();
    formData.append("actionType", values.actionType);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("visibility", String(values.visibility));
    fetcher.submit(formData, { method: "POST" });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/20 overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-violet-500 via-indigo-500 to-violet-600" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-zinc-100">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 border border-violet-100">
            <FolderKanban className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-900">Buat Proyek Baru</h2>
            <p className="text-xs text-zinc-500">Isi detail proyek yang ingin kamu buat</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">

          {/* Hidden actionType */}
          <input type="hidden" {...register("actionType")} value="createProject" />

          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="title"
              className="text-xs font-medium uppercase tracking-wide text-zinc-500"
            >
              Judul Proyek
            </Label>
            <Input
              id="title"
              placeholder="Contoh: Sistem Manajemen Inventaris"
              {...register("title")}
              className="h-9 text-sm border-zinc-200 bg-zinc-50 focus-visible:ring-violet-500/30 focus-visible:border-violet-500 placeholder:text-zinc-400"
            />
            {errors.title && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-xs font-medium uppercase tracking-wide text-zinc-500"
            >
              Deskripsi
            </Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Jelaskan tujuan dan lingkup proyek ini..."
              {...register("description")}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Visibilitas
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {VISIBILITY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedVisibility === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("visibility", opt.value)}
                    className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-violet-500 bg-violet-50 ring-1 ring-violet-500/20"
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white"
                    }`}
                  >
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                      isSelected ? "bg-violet-100" : "bg-zinc-100"
                    }`}>
                      <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-violet-600" : "text-zinc-500"}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${isSelected ? "text-violet-700" : "text-zinc-700"}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] leading-tight text-zinc-400 mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 text-xs border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-9 px-4 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1.5 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Buat Proyek
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}