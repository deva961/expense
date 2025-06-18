import { SignUpForm } from "@/app/_components/auth/register-form";
import AuthLayout from "../auth-layout";

const SignUp = () => {
  return (
    <AuthLayout description="Please sign up to continue!">
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
