import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import LoadingIndicator from './LoadingIndicator';

export default function LoginForm({ errorMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    if (result.error) {
      console.log('Login error:', result.error)
      setError(result.error);
    } else {
      router.replace('/');
    }
  };

  const handleGoogleLogin = () => signIn('google', { callbackUrl: '/' });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Admin Login</h2>
        
        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full p-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? <LoadingIndicator /> : 'Login'}
          </button>
        </form>

        <div className="text-center text-gray-500">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full p-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Login with Google
        </button>

        {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
}
