// EtudiantsPage.tsx
import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Table } from "../../../components/Table";
import { Button } from "../../../components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  type Etudiant,
  useListEtudiants,
  useCreateEtudiant,
  useUpdateEtudiant,
  useDeleteEtudiant,
} from "../hooks/useEtudiantsProvider";
import { EtudiantModalForm } from "../components/EtudiantModalForm";

export const EtudiantsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{ create?: boolean; edit?: boolean; etudiant?: Etudiant }>({});
  const { mutate: createEtudiant } = useCreateEtudiant();
  const { mutate: updateEtudiant } = useUpdateEtudiant();
  const { mutate: deleteEtudiant } = useDeleteEtudiant();
  const { data: etudiants } = useListEtudiants();

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // Récupérer l'ID depuis l'URL

  useEffect(() => {
    if (location.pathname === "/etudiants/create") {
      setModalOpen({ create: true });
    } else if (id && location.pathname.startsWith("/etudiants/edit")) {
      const etudiantToEdit = etudiants?.find((etudiant) => etudiant.id === id);
      if (etudiantToEdit) {
        setModalOpen({ edit: true, etudiant: etudiantToEdit });
      }
    }
  }, [location, id, etudiants]);

  const handleCreate = (etudiant: Omit<Etudiant, "id">) => {
    createEtudiant(etudiant, {
      onSuccess: () => {
        setModalOpen({});
        navigate("/etudiants");
      },
    });
  };

  const handleUpdate = (id: string, etudiant: Omit<Etudiant, "id">) => {
    updateEtudiant({ id, ...etudiant }, {
      onSuccess: () => {
        setModalOpen({});
        navigate("/etudiants");
      },
    });
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
          <Button onClick={() => setModalOpen({ create: true })} className="bg-gray-800 p-2 rounded-lg text-white">
            Ajouter un étudiant
          </Button>
        </div>
        <Table
          data={etudiants}
          columns={[
            { key: "nom", label: "Nom" },
            { key: "prenom", label: "Prénom" },
            { key: "email", label: "Email" },
            {
              key: "actions",
              label: "Actions",
              render: (etudiant) => (
                <div className="flex space-x-2">
                  <Button onClick={() => setModalOpen({ edit: true, etudiant })} className="text-blue-500">
                    <Edit />
                  </Button>
                  <Button onClick={() => handleDelete(etudiant.id)} className="text-red-500">
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
          navigate("/etudiants");
        }}
        onSubmit={handleSubmit}
        initialValue={modalOpen.etudiant}
      />
    </>
  );
};
