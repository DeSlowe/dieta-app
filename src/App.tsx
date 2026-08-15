import { useState } from "react";
import { PatientProvider } from "./context/PatientContext";
import Home from "./pages/Home";
import PatientList from "./pages/PatientList";
import NewPatientForm from "./pages/NewPatientForm";
import PatientWorkspace from "./pages/PatientWorkspace";

type View = "home" | "lista" | "nuovo" | "workspace";

function AppContent() {
  const [view, setView] = useState<View>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (view === "home") {
    return <Home onNavigate={(v) => setView(v)} />;
  }

  if (view === "lista") {
    return (
      <PatientList
        onSelect={(id) => {
          setSelectedId(id);
          setView("workspace");
        }}
        onNew={() => setView("nuovo")}
        onHome={() => setView("home")}
      />
    );
  }

  if (view === "nuovo") {
    return (
      <NewPatientForm
        onCreated={(id) => {
          setSelectedId(id);
          setView("workspace");
        }}
        onCancel={() => setView("home")}
      />
    );
  }

  if (view === "workspace" && selectedId) {
    return (
      <PatientWorkspace
        patientId={selectedId}
        initialTab="dieta"
        onBack={() => setView("lista")}
      />
    );
  }

  return null;
}

export default function App() {
  return (
    <PatientProvider>
      <AppContent />
    </PatientProvider>
  );
}
