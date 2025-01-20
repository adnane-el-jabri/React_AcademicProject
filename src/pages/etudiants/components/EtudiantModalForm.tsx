import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Modal, Input } from "../../../components";
import { Button } from "../../../components"; 

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (etudiant: { nom: string; prenom: string; email: string }) => void;
  initialValue?: { nom: string; prenom: string; email: string };
};

// ✅ Définition du schéma de validation avec Zod
const schema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis" }),
  prenom: z.string().min(1, { message: "Le prénom est requis" }),
  email: z.string().email({ message: "L'email doit être valide" }),
});

export const EtudiantModalForm: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialValue }) => {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "" });
  const [errors, setErrors] = useState<{ nom?: string; prenom?: string; email?: string }>({});

  useEffect(() => {
    setForm(initialValue ?? { nom: "", prenom: "", email: "" });
    setErrors({});
  }, [initialValue, isOpen]);

  const validateForm = () => {
    const result = schema.safeParse(form);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) formattedErrors[err.path[0]] = err.message;
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
        setForm({ nom: "", prenom: "", email: "" }); // ✅ Réinitialiser à la fermeture
        setErrors({});
        onClose();
      }}
    >
      <h2 className="text-xl font-bold mb-4">
        {initialValue ? "Modifier un étudiant" : "Ajouter un étudiant"}
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
          id="nom"
          label="Nom"
          value={form.nom}
          onChange={(e) => setForm((prevForm) => ({ ...prevForm, nom: e.target.value }))}
          errorMessage={errors.nom}
        />
        <Input
          id="prenom"
          label="Prénom"
          value={form.prenom}
          onChange={(e) => setForm((prevForm) => ({ ...prevForm, prenom: e.target.value }))}
          errorMessage={errors.prenom}
        />
        <Input
          id="email"
          label="Email"
          value={form.email}
          onChange={(e) => setForm((prevForm) => ({ ...prevForm, email: e.target.value }))}
          errorMessage={errors.email}
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
