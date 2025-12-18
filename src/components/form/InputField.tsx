import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function InputField({ label, ...props }) {
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Input {...props} />
    </div>
  );
}
