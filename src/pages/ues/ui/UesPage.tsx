import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Table } from "../../../components/Table";
import { Button } from "../../../components"; 
import { useLocation, useNavigate } from "react-router-dom"; // ✅ Importer pour gérer les routes
import {
  type Ue,
  useCreateUe,
  useListUes,
  useUpdateUe,
  useDeleteUe,
} from "../hooks/useUesProvider";
import { UeModalForm, PartialUe } from "./components/UeModalForm";

export const UesPage: React.FC<{ createMode?: boolean }> = ({ createMode }) => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean;
    edit?: boolean;
    ue?: Ue;
  }>({
    create: false,
    edit: false,
  });

  const location = useLocation();  // ✅ Pour détecter la route actuelle
  const navigate = useNavigate();  // ✅ Pour naviguer après la création

  const { mutate: createUe } = useCreateUe();
  const { mutate: updateUe } = useUpdateUe();
  const { mutate: deleteUe } = useDeleteUe();

  const { data } = useListUes();

  // ✅ Ouvrir automatiquement la modal si l'URL est /ues/create
  useEffect(() => {
    if (location.pathname === "/ues/create") {
      setModalOpen({ create: true });
    }
  }, [location]);

  const handleCreate = (ue: PartialUe) => {
    createUe(
      {
        nomUe: ue.nomUe,
        codeUe: ue.codeUe,
      },
      {
        onSuccess: () => {
          setModalOpen({});
          navigate("/ues");  // ✅ Rediriger vers la liste après la création
        },
      }
    );
  };

  const handleUpdate = (id: string, ue: PartialUe) => {
    updateUe(
      {
        id,
        nomUe: ue.nomUe,
        codeUe: ue.codeUe,
      },
      {
        onSuccess: () => {
          setModalOpen({});
        },
      }
    );
  };

  const handleSubmit = (ue: PartialUe) => {
    if (modalOpen.create) {
      handleCreate(ue);
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.ue?.id!, ue);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette UE ?")) {
      deleteUe({ id });
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
            Ajouter une UE
          </Button>
        </div>
        <Table
          data={data}
          columns={[
            { key: "nomUe", label: "Nom" },
            { key: "codeUe", label: "Code" },
            {
              key: "actions",
              label: "Actions",
              render: (ue) => (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setModalOpen({ edit: true, ue })}
                    className="text-blue-500"
                  >
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => handleDelete(ue.id)}
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
      <UeModalForm
        id={modalOpen.ue?.id}
        isOpen={modalOpen.edit ?? modalOpen.create ?? false}
        onClose={() => {
          setModalOpen({});
          if (location.pathname === "/ues/create") {
            navigate("/ues");  // ✅ Rediriger après fermeture si en mode création
          }
        }}
        onSubmit={handleSubmit}
        initialValue={modalOpen.ue}
      />
    </>
  );
};





/*import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Table } from "../../../components/Table";
import { Button } from "../../../components"; 
import {
  type Ue,
  useCreateUe,
  useListUes,
  useUpdateUe,
  useDeleteUe,
} from "../hooks/useUesProvider";
import { UeModalForm, PartialUe } from "./components/UeModalForm";

export const UesPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean;
    edit?: boolean;
    ue?: Ue;
  }>({
    create: false,
    edit: false,
  });

  const { mutate: createUe } = useCreateUe();
  const { mutate: updateUe } = useUpdateUe();
  const { mutate: deleteUe } = useDeleteUe();

  const { data } = useListUes();

  const handleCreate = (ue: PartialUe) => {
    createUe(
      {
        nomUe: ue.nomUe,
        codeUe: ue.codeUe,
      },
      {
        onSuccess: () => {
          setModalOpen({});
        },
      }
    );
  };

  const handleUpdate = (id: string, ue: PartialUe) => {
    updateUe(
      {
        id,
        nomUe: ue.nomUe,
        codeUe: ue.codeUe,
      },
      {
        onSuccess: () => {
          setModalOpen({});
        },
      }
    );
  };

  const handleSubmit = (ue: PartialUe) => {
    if (modalOpen.create) {
      handleCreate(ue);
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.ue?.id!, ue);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette UE ?")) {
      deleteUe({ id });
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
            Ajouter une UE
          </Button>
        </div>
        <Table
          data={data}
          columns={[
            { key: "nomUe", label: "Nom" },
            { key: "codeUe", label: "Code" },
            {
              key: "actions",
              label: "Actions",
              render: (ue) => (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setModalOpen({ edit: true, ue })}
                    className="text-blue-500"
                  >
                    <Edit />
                  </Button>
                  <Button
                    onClick={() => handleDelete(ue.id)}
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
      <UeModalForm
        id={modalOpen.ue?.id}
        isOpen={modalOpen.edit ?? modalOpen.create ?? false}
        onClose={() => setModalOpen({})}
        onSubmit={handleSubmit}
        initialValue={modalOpen.ue}
      />
    </>
  );
}; */
