import { useMutation } from "@apollo/client";
import { useState } from "react";
import { REGISTER_MUTATION } from "../graphql/mutation";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../Error";

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

interface InputProps {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
}: InputProps) => {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
      />
    </div>
  );
};

const SelectRole = ({
  value,
  onChange,
}: Pick<InputProps, "value" | "onChange">) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">
      Account Type
    </label>
    <select
      name="role"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
    >
      <option value="customer">customer</option>
      <option value="agent">agent</option>
    </select>
  </div>
);
