import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { SearchProvider } from "./components/SearchContext";
import { SearchBar } from "./components/SearchBar";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";

function App() {
  return (
    <SearchProvider>
      <KeyboardShortcuts />
      <SearchBar />
      <Sidebar />
      <div className="ml-64 p-4">
        <Outlet />
      </div>
    </SearchProvider>
  );
}

export default App;
