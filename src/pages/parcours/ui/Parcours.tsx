import { Edit, Trash2 } from "lucide-react";
import { useState } from "react"
import { Table } from "../../../components/Table"
import { Button } from "../../../components"; 
import {
  type Parcours,
  useCreateParcours,
  useListParcours,
  useUpdateParcours,
  useDeleteParcours
} from "../hooks/useParcoursProvider"
import { ParcoursModalForm,PartialParcours } from "../components/ParcoursModalForm"

export const ParcoursPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<{
    create?: boolean
    edit?: boolean
    parcours?: Parcours
  }>({
    create: false,
    edit: false,
  })

  const { mutate: createParcours } = useCreateParcours()
  const { mutate: updateParcours } = useUpdateParcours()
  const { mutate: deleteParcours } = useDeleteParcours()


  const { data } = useListParcours()

  const handleCreate = (parcours: PartialParcours) => {
    createParcours(
      {
        nomParcours: parcours.nomParcours,
        anneeFormation: parcours.anneeFormation,
      },
      {
        onSuccess: () => {
          setModalOpen({})
        },
      }
    )
  }

  const handleUpdate = (id: string, parcours: PartialParcours) => {
    updateParcours(
      {
        id,
        nomParcours: parcours.nomParcours,
        anneeFormation: parcours.anneeFormation,
      },
      {
        onSuccess: () => {
          setModalOpen({})
        },
      }
    )
  }

  const handleSubmit = (parcours: PartialParcours) => {
    if (modalOpen.create) {
      handleCreate(parcours)
    } else if (modalOpen.edit) {
      handleUpdate(modalOpen.parcours?.id!, parcours)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce parcours ?")) {
      deleteParcours({ id })
    }
  }
  

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
          data={data}
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
        onClose={() => setModalOpen({})}
        onSubmit={handleSubmit}
        initialValue={modalOpen.parcours}
      />
    </>
  )

}