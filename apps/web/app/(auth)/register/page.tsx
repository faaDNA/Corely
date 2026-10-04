import { RegisterForm } from './register-form';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white shadow-lg shadow-blue-500/20">
            C
          </div>
          <span className="font-bold text-lg text-white">Corely</span>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
