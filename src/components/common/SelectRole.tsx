import React from "react";

interface SelectRoleProps {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const SelectRole = ({
  value,
  onChange,
}: SelectRoleProps) => (
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
