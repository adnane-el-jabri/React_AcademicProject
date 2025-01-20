import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Table } from "../../../components/Table";
import { Button } from "../../../components"; 


import {
  type Etudiant,
  useListEtudiants,
  useCreateEtudiant,
  useUpdateEtudiant,
  useDeleteEtudiant
} from "../hooks/useEtudiantsProvider";
import { EtudiantModalForm } from "../components/EtudiantModalForm";

export const EtudiantsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean;
    edit?: boolean;
    etudiant?: Etudiant;
  }>({
    create: false,
    edit: false,
  });

  const { mutate: createEtudiant } = useCreateEtudiant();
  const { mutate: updateEtudiant } = useUpdateEtudiant();
  const { mutate: deleteEtudiant } = useDeleteEtudiant();

  const { data } = useListEtudiants();

  // ✅ Ajouter un étudiant
  const handleCreate = (etudiant: Omit<Etudiant, "id">) => {
    createEtudiant(etudiant, {
      onSuccess: () => {
        setModalOpen({});
      },
    });
  };

  // ✅ Modifier un étudiant
  const handleUpdate = (id: string, etudiant: Omit<Etudiant, "id">) => {
    updateEtudiant(
      { id, ...etudiant },
      {
        onSuccess: () => {
          setModalOpen({});
        },
      }
    );
  };

  // ✅ Déterminer si c'est un ajout ou une modification
  const handleSubmit = (etudiant: Omit<Etudiant, "id">) => {
    if (modalOpen.create) {
      handleCreate(etudiant);
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.etudiant?.id!, etudiant);
    }
  };

  // ✅ Supprimer un étudiant avec confirmation
  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      deleteEtudiant({ id });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* ✅ Bouton d'ajout */}
        <div className="flex justify-end">
          <Button
            onClick={() => setModalOpen({ create: true })}
            className="bg-gray-800 p-2 rounded-lg text-white"
          >
            Ajouter un étudiant
          </Button>
        </div>

        {/* ✅ Tableau des étudiants */}
        <Table
          data={data}
          columns={[
            { key: "nom", label: "Nom" },
            { key: "prenom", label: "Prénom" },
            { key: "email", label: "Email" },
            {
              key: "actions",
              label: "Actions",
              render: (etudiant) => (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setModalOpen({ edit: true, etudiant })}
                    className="text-blue-500"
                  >
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => handleDelete(etudiant.id)}
                    className="text-red-500"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* ✅ Modal d'ajout/modification */}
      <EtudiantModalForm
        isOpen={modalOpen.edit ?? modalOpen.create ?? false}
        onClose={() => setModalOpen({})}
        onSubmit={handleSubmit}
        initialValue={modalOpen.etudiant}
      />
    </>
  );
};
