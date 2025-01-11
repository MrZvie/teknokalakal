import { useSession } from 'next-auth/react';
import LoginForm from "@/components/LoginForm";
import LoadingIndicator from '@/components/LoadingIndicator';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { error } = router.query;  // Get the error message from the URL query params


  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-aqua-forest-300 z-50">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="bg-aqua-forest-600 w-screen h-screen flex items-center">
      <div className="text-center w-full">
        <LoginForm errorMessage={error} />
      </div>
    </div>
  );
}
