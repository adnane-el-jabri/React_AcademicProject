import { useState, useEffect } from "react"
import { useSearch } from "./SearchContext"
import { useNavigate } from "react-router-dom"

type Props = {}

const actions = [
  { label: "Voir la liste des parcours", path: "/parcours" },
  { label: "Créer un parcours", path: "/parcours/create" },
  { label: "Voir la liste des UEs", path: "/ues" },
  { label: "Créer une UE", path: "/ues/create" },
  { label: "Voir la liste des étudiants", path: "/etudiants" },
  { label: "Créer un étudiant", path: "/etudiants/create" },
   
];


export const SearchBar: React.FC<Props> = () => {
  const { isOpen, closeSearch } = useSearch()
  const [query, setQuery] = useState("")
  const [filteredActions, setFilteredActions] = useState(actions)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredActions(actions)
    } else {
      setFilteredActions(
        actions.filter((action) =>
          action.label.toLowerCase().includes(query.toLowerCase())
        )
      )
    }
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length)
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prev) =>
          prev === 0 ? filteredActions.length - 1 : prev - 1
        )
      } else if (event.key === "Enter") {
        if (filteredActions[selectedIndex]) {
          navigate(filteredActions[selectedIndex].path)
          closeSearch()
        }
      } else if (event.key === "Escape") {
        closeSearch()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, filteredActions, navigate, closeSearch])

  if (!isOpen) return null

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
                navigate(action.path)
                closeSearch()
              }}
            >
              {action.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
