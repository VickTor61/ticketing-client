import { useMutation } from "@apollo/client";
import { useState } from "react";
import { REGISTER_MUTATION } from "../graphql/mutation";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../Error";
import { Input } from "./common/Input";
import { SelectRole } from "./common/SelectRole";

export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    role: "customer",
  });

  const [register, { loading, error }] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => {
      navigate("/login");
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await register({
        variables: {
          input: {
            userInput: formData,
          },
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
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
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center min-h-screen"
    >
      <div className="w-full max-w-md p-4 bg-white rounded-md shadow">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-600">Join ticketing platform today</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-x-3">
            <Input
              label="First Name"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Input
            label="Email"
            name="email"
            placeholder="johndoe@example.com"
            value={formData.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Input
            label="Password confirmation"
            name="passwordConfirmation"
            type="password"
            placeholder="Enter password confirmation"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <SelectRole value={formData.role} onChange={handleChange} />
          {error && <ErrorComponent error={error} />}

          <button
            disabled={loading}
            className="w-full px-4 py-2 text-white transition duration-200 bg-black rounded-lg hover:bg-black-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </form>
  );
};
