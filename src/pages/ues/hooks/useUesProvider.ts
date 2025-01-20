import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Ue = {
  id: string;
  nomUe: string;
  codeUe: string;
};

const LOCAL_STORAGE_KEY_UE = "uesData";

const getUesFromLocalStorage = (): Ue[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_UE);
  return data ? JSON.parse(data) : [];
};

const setUesToLocalStorage = (ues: Ue[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_UE, JSON.stringify(ues));
};

if (!localStorage.getItem(LOCAL_STORAGE_KEY_UE)) {
  setUesToLocalStorage([
    { id: "1", nomUe: "Programmation", codeUe: "UE101" },
    { id: "2", nomUe: "Mathématiques", codeUe: "UE102" },
  ]);
}

export const useListUes = () => {
    const fetchUes = async (): Promise<Ue[]> => {
      return getUesFromLocalStorage();
    };
  
    return useQuery<Ue[], Error>({
      queryKey: ["ues"],
      queryFn: fetchUes,
    });
  };

  export const useCreateUe = () => {
    type Input = { nomUe: string; codeUe: string };
    const queryClient = useQueryClient();
  
    const createUe = async ({ nomUe, codeUe }: Input): Promise<Ue> => {
      const newUe: Ue = { id: Date.now().toString(), nomUe, codeUe };
      const currentUes = getUesFromLocalStorage();
      setUesToLocalStorage([...currentUes, newUe]);
      return newUe;
    };
  
    return useMutation<Ue, Error, Input>({
      mutationFn: createUe,
      onMutate: async (newUe) => {
        await queryClient.cancelQueries({ queryKey: ["ues"] });
        queryClient.setQueryData<Ue[]>(["ues"], (old) => [
          ...(old || []),
          { id: Date.now().toString(), ...newUe },
        ]);
      },
    });
  };

  export const useUpdateUe = () => {
    type Input = { id: string; nomUe?: string; codeUe?: string };
    const queryClient = useQueryClient();
  
    const updateUe = async ({ id, nomUe, codeUe }: Input): Promise<Ue> => {
      const currentUes = getUesFromLocalStorage();
      const updatedUes = currentUes.map((ue) =>
        ue.id === id ? { ...ue, nomUe: nomUe || ue.nomUe, codeUe: codeUe || ue.codeUe } : ue
      );
      setUesToLocalStorage(updatedUes);
      return updatedUes.find((ue) => ue.id === id)!;
    };
  
    return useMutation<Ue, Error, Input>({
      mutationFn: updateUe,
      onMutate: async (updatedUe) => {
        queryClient.setQueryData<Ue[]>(["ues"], (old) =>
          (old || []).map((ue) =>
            ue.id === updatedUe.id ? { ...ue, ...updatedUe } : ue
          )
        );
      },
    });
  };

  export const useDeleteUe = () => {
    type Input = { id: string };
    const queryClient = useQueryClient();
  
    const deleteUe = async ({ id }: Input): Promise<{ id: string }> => {
      const currentUes = getUesFromLocalStorage();
      setUesToLocalStorage(currentUes.filter((ue) => ue.id !== id));
      return { id };
    };
  
    return useMutation<{ id: string }, Error, Input>({
      mutationFn: deleteUe,
      onMutate: ({ id }) => {
        queryClient.setQueryData<Ue[]>(["ues"], (old) =>
          (old || []).filter((ue) => ue.id !== id)
        );
      },
    });
  };
  