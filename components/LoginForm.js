import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import swal from "sweetalert2";
import EyeSlashIcon from "./EyeSlashIcon";
import EyeIcon from "./EyeIcons";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async (email, password) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      swal.fire("Login failed", result.error, "error");
    } else if (result?.ok && result?.status === 200) {
      router.replace("/"); // Redirect to the home page after successful login
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    await handleSignIn(email, password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="bg-aqua-forest-600 w-screen h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full text-center">
        <h1 className="text-xl font-bold text-aqua-forest-600">TeknoKalakal Admin</h1>
        <p className="text-gray-600">Sign in to your account.</p>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded-md pr-10"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-aqua-forest-600 text-white rounded-md hover:bg-aqua-forest-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}