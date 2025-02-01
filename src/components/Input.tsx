import React from "react";

type InputProps = {
  id: string;
  label: string;
  errorMessage?: string; // Ajout d'une prop pour afficher les erreurs
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({
  id,
  label,
  errorMessage, // Ajout de la gestion des erreurs
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border ${
          errorMessage ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 ${
          errorMessage ? "focus:ring-red-500" : "focus:ring-blue-500"
        }`}
      />
      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
    </div>
  );
};
