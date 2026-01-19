import "./Sidepanel.css";

const Sidepanel = ({ activeTab, handleTabChange }) => {
  return (
    <aside className="Sidepanel">
      <button
        type="button"
        className={`Sidepanel__item Sidepanel__item--top ${
          activeTab === "dashboard" ? "is-active" : ""
        }`}
        onClick={() => handleTabChange("dashboard")}
      >
        <span className="Sidepanel__label">DASHBOARD</span>
        <span className="Sidepanel__rightAccent" />
      </button>

      <button
        type="button"
        className={`Sidepanel__item Sidepanel__item--bottom ${
          activeTab === "library" ? "is-active" : ""
        }`}
        onClick={() => handleTabChange("library")}
      >
        <span className="Sidepanel__label">LIBRARY</span>
        <span className="Sidepanel__rightAccent" />
      </button>
    </aside>
  );
};

export default Sidepanel;
