import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type InputFieldProps = {
  label?: string;
  error?: boolean;
  helperText?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function InputField({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputFieldProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={inputId} className="text-sm">
          {label}
        </Label>
      )}

      <Input
        id={inputId}
        aria-invalid={error || undefined}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...props}
      />

      {helperText && <p className="text-destructive text-sm">{helperText}</p>}
    </div>
  );
}
