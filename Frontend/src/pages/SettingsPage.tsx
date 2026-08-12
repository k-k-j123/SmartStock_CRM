import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { validateNumber, validateUrl } from "@/lib/validation";

type SettingsForm = {
  backendUrl: string;
  analyticsUrl: string;
  lowStockThreshold: string;
};

const initialSettings: SettingsForm = {
  backendUrl: "http://localhost:8080",
  analyticsUrl: "http://localhost:8000",
  lowStockThreshold: "10",
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(initialSettings);
  const [errors, setErrors] = useState<Partial<Record<keyof SettingsForm, string>>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof SettingsForm, string>> = {
      backendUrl: validateUrl(form.backendUrl, "Backend API URL"),
      analyticsUrl: validateUrl(form.analyticsUrl, "Analytics API URL"),
      lowStockThreshold: validateNumber(form.lowStockThreshold, "Low stock threshold", {
        min: 0,
        integer: true,
      }),
    };
    const activeErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, message]) => message));

    setErrors(activeErrors);

    if (Object.keys(activeErrors).length) {
      toast.error("Please fix the highlighted settings");
      return;
    }

    toast.success("Settings validated");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Settings</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl bg-card p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">API Configuration</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-backend-url">Backend API URL</Label>
              <Input
                id="settings-backend-url"
                type="url"
                value={form.backendUrl}
                onChange={(event) => setForm((current) => ({ ...current, backendUrl: event.target.value }))}
                className="rounded-xl"
                required
                aria-invalid={Boolean(errors.backendUrl)}
              />
              {errors.backendUrl && <p className="text-xs text-destructive">{errors.backendUrl}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-analytics-url">Analytics API URL</Label>
              <Input
                id="settings-analytics-url"
                type="url"
                value={form.analyticsUrl}
                onChange={(event) => setForm((current) => ({ ...current, analyticsUrl: event.target.value }))}
                className="rounded-xl"
                required
                aria-invalid={Boolean(errors.analyticsUrl)}
              />
              {errors.analyticsUrl && <p className="text-xs text-destructive">{errors.analyticsUrl}</p>}
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-low-stock-threshold">Low Stock Threshold (default)</Label>
              <Input
                id="settings-low-stock-threshold"
                type="number"
                min={0}
                step={1}
                value={form.lowStockThreshold}
                onChange={(event) => setForm((current) => ({ ...current, lowStockThreshold: event.target.value }))}
                className="rounded-xl"
                required
                aria-invalid={Boolean(errors.lowStockThreshold)}
              />
              {errors.lowStockThreshold && <p className="text-xs text-destructive">{errors.lowStockThreshold}</p>}
            </div>
          </div>
        </div>

        <Button type="submit" className="rounded-xl">Save Settings</Button>
      </form>
    </div>
  );
}
