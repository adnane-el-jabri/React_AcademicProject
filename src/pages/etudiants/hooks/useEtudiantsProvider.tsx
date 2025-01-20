import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Etudiant = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
};

const LOCAL_STORAGE_KEY_ETUDIANT = "etudiantsData";

// ✅ Fonction pour récupérer les étudiants depuis le LocalStorage
const getEtudiantsFromLocalStorage = (): Etudiant[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_ETUDIANT);
  return data ? JSON.parse(data) : [];
};

// ✅ Fonction pour sauvegarder les étudiants dans le LocalStorage
const setEtudiantsToLocalStorage = (etudiants: Etudiant[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_ETUDIANT, JSON.stringify(etudiants));
};

// ✅ Initialisation des données si le LocalStorage est vide
if (!localStorage.getItem(LOCAL_STORAGE_KEY_ETUDIANT)) {
  setEtudiantsToLocalStorage([
    { id: "1", nom: "Dupont", prenom: "Jean", email: "jean.dupont@example.com" },
    { id: "2", nom: "Martin", prenom: "Sophie", email: "sophie.martin@example.com" },
  ]);
}

// ✅ Hook pour récupérer la liste des étudiants
export const useListEtudiants = () => {
  const fetchEtudiants = async (): Promise<Etudiant[]> => {
    return getEtudiantsFromLocalStorage();
  };

  return useQuery<Etudiant[], Error>({
    queryKey: ["etudiants"],
    queryFn: fetchEtudiants,
  });
};

// ✅ Hook pour créer un étudiant
export const useCreateEtudiant = () => {
  type Input = { nom: string; prenom: string; email: string };
  const queryClient = useQueryClient();

  const createEtudiant = async ({ nom, prenom, email }: Input): Promise<Etudiant> => {
    const newEtudiant: Etudiant = { id: Date.now().toString(), nom, prenom, email };
    const currentEtudiants = getEtudiantsFromLocalStorage();
    setEtudiantsToLocalStorage([...currentEtudiants, newEtudiant]);
    return newEtudiant;
  };

  return useMutation<Etudiant, Error, Input>({
    mutationFn: createEtudiant,
    onMutate: async (newEtudiant) => {
        await queryClient.cancelQueries({ queryKey: ["etudiants"] }); // ✅ Nouvelle syntaxe
        queryClient.setQueryData<Etudiant[]>(["etudiants"], (old) => [
        ...(old || []),
        { id: Date.now().toString(), ...newEtudiant },
      ]);
    },
  });
};

// ✅ Hook pour mettre à jour un étudiant
export const useUpdateEtudiant = () => {
  type Input = { id: string; nom?: string; prenom?: string; email?: string };
  const queryClient = useQueryClient();

  const updateEtudiant = async ({ id, nom, prenom, email }: Input): Promise<Etudiant> => {
    const currentEtudiants = getEtudiantsFromLocalStorage();
    const updatedEtudiants = currentEtudiants.map((etudiant) =>
      etudiant.id === id
        ? { ...etudiant, nom: nom || etudiant.nom, prenom: prenom || etudiant.prenom, email: email || etudiant.email }
        : etudiant
    );
    setEtudiantsToLocalStorage(updatedEtudiants);
    return updatedEtudiants.find((etudiant) => etudiant.id === id)!;
  };

  return useMutation<Etudiant, Error, Input>({
    mutationFn: updateEtudiant,
    onMutate: async (updatedEtudiant) => {
      queryClient.setQueryData<Etudiant[]>(["etudiants"], (old) =>
        (old || []).map((etudiant) =>
          etudiant.id === updatedEtudiant.id ? { ...etudiant, ...updatedEtudiant } : etudiant
        )
      );
    },
  });
};

// ✅ Hook pour supprimer un étudiant
export const useDeleteEtudiant = () => {
  type Input = { id: string };
  const queryClient = useQueryClient();

  const deleteEtudiant = async ({ id }: Input): Promise<{ id: string }> => {
    const currentEtudiants = getEtudiantsFromLocalStorage();
    setEtudiantsToLocalStorage(currentEtudiants.filter((etudiant) => etudiant.id !== id));
    return { id };
  };

  return useMutation<{ id: string }, Error, Input>({
    mutationFn: deleteEtudiant,
    onMutate: ({ id }) => {
      queryClient.setQueryData<Etudiant[]>(["etudiants"], (old) =>
        (old || []).filter((etudiant) => etudiant.id !== id)
      );
    },
  });
};
