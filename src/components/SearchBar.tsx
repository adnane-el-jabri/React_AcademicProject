import { useState, useEffect } from "react";
import { useSearch } from "./SearchContext";
import { useNavigate } from "react-router-dom";
import { useListUes } from "../pages/ues/hooks/useUesProvider";
import { useListEtudiants } from "../pages/etudiants/hooks/useEtudiantsProvider";
import { useListParcours } from "../pages/parcours/hooks/useParcoursProvider";

type Props = {};

const baseActions = [
  { label: "Voir la liste des parcours", path: "/parcours" },
  { label: "Créer un parcours", path: "/parcours/create" },
  { label: "Voir la liste des UEs", path: "/ues" },
  { label: "Créer une UE", path: "/ues/create" },
  { label: "Voir la liste des étudiants", path: "/etudiants" },
  { label: "Créer un étudiant", path: "/etudiants/create" },
];

export const SearchBar: React.FC<Props> = () => {
  const { isOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [filteredActions, setFilteredActions] = useState(baseActions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Récupération des données pour la recherche dynamique
  const { data: ues } = useListUes();
  const { data: etudiants } = useListEtudiants();
  const { data: parcours } = useListParcours();

  // Filtrage des actions en fonction de la recherche
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredActions(baseActions);
    } else {
      const queryLower = query.toLowerCase();

      const filteredBaseActions = baseActions.filter((action) =>
        action.label.toLowerCase().includes(queryLower)
      );

      const filteredUeActions = (ues || [])
        .filter((ue) => ue.nomUe.toLowerCase().includes(queryLower))
        .map((ue) => ({
          label: `Modifier ${ue.nomUe}`,
          path: `/ues/edit/${ue.id}`,
        }));

      const filteredEtudiantActions = (etudiants || [])
        .filter((etudiant) =>
          `${etudiant.nom} ${etudiant.prenom}`.toLowerCase().includes(queryLower)
        )
        .map((etudiant) => ({
          label: `Modifier ${etudiant.nom} ${etudiant.prenom}`,
          path: `/etudiants/edit/${etudiant.id}`,
        }));

      const filteredParcoursActions = (parcours || [])
        .filter((parcour) => parcour.nomParcours.toLowerCase().includes(queryLower))
        .map((parcour) => ({
          label: `Modifier ${parcour.nomParcours}`,
          path: `/parcours/edit/${parcour.id}`,
        }));

      setFilteredActions([
        ...filteredBaseActions,
        ...filteredUeActions,
        ...filteredEtudiantActions,
        ...filteredParcoursActions,
      ]);
    }

    setSelectedIndex(0);
  }, [query, ues, etudiants, parcours]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prev) =>
          prev === 0 ? filteredActions.length - 1 : prev - 1
        );
      } else if (event.key === "Enter") {
        if (filteredActions[selectedIndex]) {
          navigate(filteredActions[selectedIndex].path);
          resetSearch();  // ✅ Réinitialisation après navigation
        }
      } else if (event.key === "Escape") {
        resetSearch();  // ✅ Réinitialisation après fermeture avec ESC
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredActions, navigate]);

  // ✅ Réinitialisation du champ de recherche et des actions
  const resetSearch = () => {
    setQuery("");
    setFilteredActions(baseActions);
    closeSearch();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <ul className="mt-2">
          {filteredActions.map((action, index) => (
            <li
              key={action.path}
              className={`p-2 cursor-pointer ${
                index === selectedIndex ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                navigate(action.path);
                resetSearch();  // ✅ Nettoyer la recherche après sélection
              }}
            >
              {action.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};




/*import { useState, useEffect } from "react";
import { useSearch } from "./SearchContext";
import { useNavigate } from "react-router-dom";
import { useListUes } from "../pages/ues/hooks/useUesProvider";
import { useListEtudiants } from "../pages/etudiants/hooks/useEtudiantsProvider";
import { useListParcours } from "../pages/parcours/hooks/useParcoursProvider";

type Props = {};

const actions = [
  { label: "Voir la liste des parcours", path: "/parcours" },
  { label: "Créer un parcours", path: "/parcours/create" },
  { label: "Voir la liste des UEs", path: "/ues" },
  { label: "Créer une UE", path: "/ues/create" },
  { label: "Voir la liste des étudiants", path: "/etudiants" },
  { label: "Créer un étudiant", path: "/etudiants/create" },
];

export const SearchBar: React.FC<Props> = () => {
  const { isOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [filteredActions, setFilteredActions] = useState(actions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const { data: ues } = useListUes();
  const { data: etudiants } = useListEtudiants();
  const { data: parcours } = useListParcours();

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredActions(actions);
    } else {
      const queryLower = query.toLowerCase();

      // 1️⃣ Filtrer les actions de base
      const filteredBaseActions = actions.filter((action) =>
        action.label.toLowerCase().includes(queryLower)
      );

      // 2️⃣ Ajouter les UEs filtrées
      const filteredUeActions = (ues || [])
        .filter((ue) => ue.nomUe.toLowerCase().includes(queryLower))
        .map((ue) => ({
          label: `Modifier ${ue.nomUe}`,
          path: `/ues/edit/${ue.id}`,
        }));

      // 3️⃣ Ajouter les Étudiants filtrés
      const filteredEtudiantActions = (etudiants || [])
        .filter(
          (etudiant) =>
            etudiant.nom.toLowerCase().includes(queryLower) ||
            etudiant.prenom.toLowerCase().includes(queryLower)
        )
        .map((etudiant) => ({
          label: `Modifier ${etudiant.nom} ${etudiant.prenom}`,
          path: `/etudiants/edit/${etudiant.id}`,
        }));

      // 4️⃣ Ajouter les Parcours filtrés
      const filteredParcoursActions = (parcours || [])
        .filter((parc) => parc.nomParcours.toLowerCase().includes(queryLower))
        .map((parc) => ({
          label: `Modifier ${parc.nomParcours}`,
          path: `/parcours/edit/${parc.id}`,
        }));

      // 5️⃣ Combiner tous les résultats
      setFilteredActions([
        ...filteredBaseActions,
        ...filteredUeActions,
        ...filteredEtudiantActions,
        ...filteredParcoursActions,
      ]);
    }
    setSelectedIndex(0);
  }, [query, ues, etudiants, parcours]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prev) =>
          prev === 0 ? filteredActions.length - 1 : prev - 1
        );
      } else if (event.key === "Enter") {
        if (filteredActions[selectedIndex]) {
          navigate(filteredActions[selectedIndex].path);
          closeSearch();
        }
      } else if (event.key === "Escape") {
        closeSearch();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredActions, navigate, closeSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <ul className="mt-2">
          {filteredActions.map((action, index) => (
            <li
              key={action.path}
              className={`p-2 cursor-pointer ${
                index === selectedIndex ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                navigate(action.path);
                closeSearch();
              }}
            >
              {action.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
*/