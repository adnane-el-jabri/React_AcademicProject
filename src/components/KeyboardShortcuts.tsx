import { useEffect } from "react"
import { useSearch } from "./SearchContext"

type Props = {
    
}

export const KeyboardShortcuts: React.FC<Props> = () => {
  const { openSearch } = useSearch()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault()
        openSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [openSearch])

  return null
}
