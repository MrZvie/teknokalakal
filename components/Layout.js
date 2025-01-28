import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession hook
import { useRouter } from 'next/router'; // Import useRouter hook
import LoadingIndicator from '@/components/LoadingIndicator';
import Logo from './Logo';
import Nav from '@/components/Nav';

export default function Layout({ children }) {
  const { data: session, status } = useSession(); // Access session data and status
  const router = useRouter();
  const [showNav, setShowNav] = useState(false); // Manage visibility of the navigation menu

  // console.log("Session data:", session);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Display loading indicator while session is loading
  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-aqua-forest-300 z-50">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="bg-aqua-forest-600 min-h-screen">
      {/* Mobile navigation button */}
      <div className="md:hidden text-white flex items-center p-2">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>

      <div className="flex">
        {/* Nav component */}
        <Nav show={showNav} />
        <div className="bg-white flex-grow sm:mt-0 sm:ml-5 sm:mr-5 md:mt-5 mb-5 mr-0 md:ml-0 rounded-lg p-4 overflow-y-auto h-[690px]">
          {children}
        </div>
      </div>
    </div>
  );
}
