import { useState } from "react";
import { Input } from "./register";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutation";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../Error";
import { setToken } from "../utils/helpers";

export const Login = () => {
  const navigate = useNavigate();
  const client = useApolloClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      const token = data.login.token;
      setToken(token);
      await client.resetStore();
      navigate("/");
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await login({
        variables: {
          input: formData,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-2 mx-4 bg-white rounded-md shadow">
        <div className="mt-2 mb-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="px-4 space-y-6">
          <Input
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Input
            label="Email Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          {error && <ErrorComponent error={error} />}

          <button
            disabled={loading}
            className="w-full px-4 py-2 text-white transition duration-200 bg-black rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="mt-4 text-center">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>

        <div className="hidden p-4 mt-4 rounded-lg bg-gray-50">
          <p className="mb-2 text-sm font-medium text-gray-600">
            Demo Accounts:
          </p>
          <p className="text-xs text-gray-500">
            Customer: customer@test.com / password
          </p>
          <p className="text-xs text-gray-500">
            Agent: agent@test.com / password
          </p>
        </div>
      </div>
    </div>
  );
};
