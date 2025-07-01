import React, { useState } from "react";
import { Priority } from "../../graphql/query";

interface SubmitProps {
  title: string;
  description: string;
  priority: Priority;
}

export const CreateTicket = ({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: ({ title, description, priority }: SubmitProps) => void;
  onCancel: () => void;
  loading?: boolean;
}) => {
  const DEFAULT_FORM_STATE: SubmitProps = {
    title: "",
    description: "",
    priority: "low",
  };
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      onSubmit(formData);
      setFormData(DEFAULT_FORM_STATE);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 mx-auto space-y-4 bg-white border rounded-md shadow">
        <h1 className="text-lg font-semibold">Create New Ticket</h1>
      <Input label="title" value={formData.title} onChange={handleChange} />
      <Input
        label="description"
        value={formData.description}
        onChange={handleChange}
      />

      <div>
        <label htmlFor="priority" className="block mb-1 font-medium">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm placeholder:capitalize"
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <button
        type="submit"
        className="text-sm bg-black text-white font-medium py-1.5 px-2.5 capitalize rounded-md cursor-pointer mr-2"
      >
        {loading ? "Creating..." : "Create Ticket"}
      </button>
      <button
        onClick={onCancel}
        className="text-sm bg-black text-white font-medium py-1.5 px-2.5 capitalize rounded-md cursor-pointer"
      >
        Cancel
      </button>
    </form>
  );
};

interface InputProps {
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ label, type, value, onChange }: InputProps) => (
  <div>
    <label
      htmlFor={label}
      className="block mb-1 text-sm font-medium capitalize"
    >
      {label}
    </label>
    <input
      id={label}
      name={label}
      type={type || "text"}
      value={value}
      onChange={onChange}
      placeholder={label}
      className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm placeholder:capitalize"
      required
    />
  </div>
);
