import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Table } from "../../../components/Table";
import { Button } from "../../../components"; 
import { useLocation, useNavigate } from "react-router-dom"; 

import {
  type Etudiant,
  useListEtudiants,
  useCreateEtudiant,
  useUpdateEtudiant,
  useDeleteEtudiant
} from "../hooks/useEtudiantsProvider";
import { EtudiantModalForm } from "../components/EtudiantModalForm";

// ✅ Définir le type de la prop createMode
interface EtudiantsPageProps {
  createMode?: boolean;
}

export const EtudiantsPage: React.FC<EtudiantsPageProps> = ({ createMode }) => {
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

  const location = useLocation();  
  const navigate = useNavigate();  

  // ✅ Ouvrir automatiquement la modal si createMode est vrai ou si l'URL est /etudiants/create
  useEffect(() => {
    if (location.pathname === "/etudiants/create" || createMode) {
      setModalOpen({ create: true });
    }
  }, [location, createMode]);

  const handleCreate = (etudiant: Omit<Etudiant, "id">) => {
    createEtudiant(etudiant, {
      onSuccess: () => {
        setModalOpen({});
        navigate("/etudiants");  // ✅ Retour à la liste après création
      },
    });
  };

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

  const handleSubmit = (etudiant: Omit<Etudiant, "id">) => {
    if (modalOpen.create) {
      handleCreate(etudiant);
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.etudiant?.id!, etudiant);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      deleteEtudiant({ id });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={() => setModalOpen({ create: true })}
            className="bg-gray-800 p-2 rounded-lg text-white"
          >
            Ajouter un étudiant
          </Button>
        </div>

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

      <EtudiantModalForm
        isOpen={modalOpen.edit ?? modalOpen.create ?? false}
        onClose={() => {
          setModalOpen({});
          if (location.pathname === "/etudiants/create") {
            navigate("/etudiants");  // ✅ Retour à la liste si modal fermée depuis /etudiants/create
          }
        }}
        onSubmit={handleSubmit}
        initialValue={modalOpen.etudiant}
      />
    </>
  );
};
