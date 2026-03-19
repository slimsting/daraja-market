// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/features/auth/Register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
