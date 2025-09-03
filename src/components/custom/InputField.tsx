import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

export const InputField = ({
  label,
  type = "text",
  className = "",
  placeholder
}: {
  label: string;
  type: string;
  className: string;
  placeholder?: string;
}) => {
  return <div className={`flex flex-col space-y-1 ${className}`}>
    <Label>{label}</Label>
    <Input placeholder={placeholder} />
  </div>;
};
