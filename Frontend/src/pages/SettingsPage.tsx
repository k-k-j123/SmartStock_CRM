import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Settings</h2>

      <div className="max-w-2xl rounded-2xl bg-card p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">API Configuration</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Backend API URL</Label>
              <Input defaultValue="http://localhost:8080" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Analytics API URL</Label>
              <Input defaultValue="http://localhost:8000" className="rounded-xl" />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Low Stock Threshold (default)</Label>
              <Input type="number" defaultValue="10" className="rounded-xl" />
            </div>
          </div>
        </div>

        <Button className="rounded-xl">Save Settings</Button>
      </div>
    </div>
  );
}
