import { Suspense } from "react";

import AuthLayout from "../auth-layout";
import { LoginForm } from "@/app/_components/auth/login-form";

const SignIn = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout description="Welcome Back! Please sign in to continue.">
        <LoginForm />
      </AuthLayout>
    </Suspense>
  );
};

export default SignIn;
