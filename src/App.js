import { useState } from "react";
import "./App.css";
import Sidepanel from "./Sidepanel";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LibraryPage from "./pages/library/LibraryPage";

function App() {
  const [activeTab, setActiveTab] = useState("library");

  return (
    <div className="AppLayout">
      <div className="SidepanelWrapper">
        <Sidepanel activeTab={activeTab} handleTabChange={setActiveTab} />
      </div>

      <div className="MainPage">
        {activeTab === "dashboard" ? <DashboardPage /> : <LibraryPage />}
      </div>
    </div>
  );
}

export default App;
