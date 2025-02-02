// ParcoursPage.tsx
import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Table } from "../../../components/Table";
import { Button } from "../../../components";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  type Parcours,
  useCreateParcours,
  useListParcours,
  useUpdateParcours,
  useDeleteParcours,
} from "../hooks/useParcoursProvider";
import { ParcoursModalForm, PartialParcours } from "../components/ParcoursModalForm";

export const ParcoursPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{ create?: boolean; edit?: boolean; parcours?: Parcours }>({});
  const { mutate: createParcours } = useCreateParcours();
  const { mutate: updateParcours } = useUpdateParcours();
  const { mutate: deleteParcours } = useDeleteParcours();
  const { data: parcoursList } = useListParcours();

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();  // Récupération de l'ID depuis l'URL

  // Ouvrir automatiquement la modal pour la création ou l'édition en fonction de l'URL
  useEffect(() => {
    if (location.pathname === "/parcours/create") {
      setModalOpen({ create: true });
    } else if (id && location.pathname.startsWith("/parcours/edit")) {
      const parcoursToEdit = parcoursList?.find((p) => p.id === id);
      if (parcoursToEdit) {
        setModalOpen({ edit: true, parcours: parcoursToEdit });
      }
    }
  }, [location, id, parcoursList]);

  const handleCreate = (parcours: PartialParcours) => {
    createParcours(
      {
        nomParcours: parcours.nomParcours,
        anneeFormation: parcours.anneeFormation,
      },
      {
        onSuccess: () => {
          setModalOpen({});
          navigate("/parcours");  // Redirection après la création
        },
      }
    );
  };

  const handleUpdate = (id: string, parcours: PartialParcours) => {
    updateParcours(
      {
        id,
        nomParcours: parcours.nomParcours,
        anneeFormation: parcours.anneeFormation,
      },
      {
        onSuccess: () => {
          setModalOpen({});
          navigate("/parcours");  // Redirection après la modification
        },
      }
    );
  };

  const handleSubmit = (parcours: PartialParcours) => {
    if (modalOpen.create) {
      handleCreate(parcours);
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.parcours?.id!, parcours);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce parcours ?")) {
      deleteParcours({ id });
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
            Ajouter un parcours
          </Button>
        </div>

        <Table
          data={parcoursList}
          columns={[
            { key: "nomParcours", label: "Nom" },
            { key: "anneeFormation", label: "Année" },
            {
              key: "actions",
              label: "Actions",
              render: (parcours) => (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setModalOpen({ edit: true, parcours })}
                    className="text-blue-500"
                  >
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => handleDelete(parcours.id)}
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

      <ParcoursModalForm
        id={modalOpen.parcours?.id}
        isOpen={modalOpen.edit ?? modalOpen.create ?? false}
        onClose={() => {
          setModalOpen({});
          navigate("/parcours");  // Redirection après fermeture de la modal
        }}
        onSubmit={handleSubmit}
        initialValue={modalOpen.parcours}
      />
    </>
  );
};
