import { Suspense } from "react";

import { LoginForm } from "@/app/_components/auth/login-form";
import AuthLayout from "./(auth)/auth-layout";

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
