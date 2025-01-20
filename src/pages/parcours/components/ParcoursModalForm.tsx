import { useEffect, useState } from "react";
import { z } from "zod";
import { Modal, Input, InputSelect } from "../../../components";
import { Parcours } from "../hooks/useParcoursProvider";
import { Button } from "../../../components"; 

export type PartialParcours = Omit<Parcours, "id"> | Parcours;

type Props = {
  isOpen: boolean;
  onSubmit: (parcours: PartialParcours) => void;
  onClose: () => void;
  id?: string;
  initialValue?: PartialParcours;
};

// Schéma de validation Zod
const schema = z.object({
  nomParcours: z.string().min(1, { message: "Le nom du parcours est requis" }),
  anneeFormation: z.number().min(1, { message: "Sélectionnez une année valide" }).max(2),
});

export const ParcoursModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  id,
  initialValue,
}) => {
  const [form, setForm] = useState<PartialParcours>({ anneeFormation: 1, nomParcours: "" });
  const [errors, setErrors] = useState<{ nomParcours?: string; anneeFormation?: string }>({});

  // ✅ Réinitialiser le formulaire lorsqu'on ouvre la modal
  useEffect(() => {
    if (isOpen) {
      if (initialValue) {
        setForm(initialValue); // Remplir les champs si on édite
      } else {
        setForm({ anneeFormation: 1, nomParcours: "" }); // Vider les champs si on ajoute
      }
      setErrors({}); // Réinitialiser les erreurs
    }
  }, [isOpen, initialValue]);

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
        setForm({ anneeFormation: 1, nomParcours: "" }); // ✅ Réinitialiser à la fermeture
        setErrors({});
        onClose();
      }}
    >
      <h2 className="text-xl font-bold mb-4">
        {id ? "Modifier un parcours" : "Ajouter un parcours"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateForm()) {
            onSubmit({ id, ...form });
          }
        }}
      >
        <Input
          id="name"
          label="Nom du parcours"
          value={form.nomParcours}
          onChange={(e) => setForm((prevForm) => ({ ...prevForm, nomParcours: e.target.value }))}
          errorMessage={errors.nomParcours}
        />
        <InputSelect
          id="year"
          label="Année"
          options={[
            { value: "1", label: "1ère année" },
            { value: "2", label: "2ème année" },
          ]}
          value={form.anneeFormation}
          onChange={(value) => setForm((prevForm) => ({ ...prevForm, anneeFormation: parseInt(value) }))}
          errorMessage={errors.anneeFormation}
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
