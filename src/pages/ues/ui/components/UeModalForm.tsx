import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Ue } from "../../hooks/useUesProvider";
import { Modal, Input } from "../../../../components";
import { Button } from "../../../../components"; 
export type PartialUe = Omit<Ue, "id"> | Ue;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ue: { nomUe: string; codeUe: string }) => void;
  id?: string;
  initialValue?: { nomUe: string; codeUe: string };
};

// ✅ Définition du schéma de validation avec Zod
const schema = z.object({
  nomUe: z.string().min(1, { message: "Le nom de l'UE est requis" }),
  codeUe: z.string().min(1, { message: "Le code de l'UE est requis" }),
});

export const UeModalForm: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialValue }) => {
  const [form, setForm] = useState({ nomUe: "", codeUe: "" });
  const [errors, setErrors] = useState<{ nomUe?: string; codeUe?: string }>({});

  

  useEffect(() => {
    if (initialValue) {
      setForm(initialValue);
    } else {
      setForm({ nomUe: "", codeUe: "" });
    }
    setErrors({}); // ✅ Réinitialisation des erreurs à l'ouverture
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  // ✅ Validation avant soumission
  const validateForm = () => {
    const result = schema.safeParse(form);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          formattedErrors[err.path[0]] = err.message;
        }
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setForm({ nomUe: "", codeUe: "" }); // ✅ Réinitialisation des champs à la fermeture
        setErrors({});
        onClose();
      }}
    >
      <h2 className="text-xl font-bold mb-4">
        {initialValue ? "Modifier une UE" : "Ajouter une UE"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateForm()) {
            onSubmit(form);
          }
        }}
      >
        <Input
          id="nomUe"
          label="Nom de l'UE"
          value={form.nomUe}
          onChange={(e) => setForm((prevForm) => ({ ...prevForm, nomUe: e.target.value }))}
          errorMessage={errors.nomUe}
        />
        <Input
          id="codeUe"
          label="Code de l'UE"
          value={form.codeUe}
          onChange={(e) => setForm((prevForm) => ({ ...prevForm, codeUe: e.target.value }))}
          errorMessage={errors.codeUe}
        />
        <div className="flex justify-end mt-4">
          <Button type="submit" className="bg-blue-500 p-2 rounded-lg text-white">
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
);

};
