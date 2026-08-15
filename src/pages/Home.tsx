import { Users, UserPlus } from "lucide-react";

type Props = {
  onNavigate: (view: "lista" | "nuovo") => void;
};

export default function Home({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Gestione Diete</h1>
        <p className="text-slate-500 mb-10">Cosa vuoi fare?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => onNavigate("lista")}
            className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition flex flex-col items-center gap-3"
          >
            <Users className="w-10 h-10 text-blue-600" />
            <span className="text-lg font-semibold">Elenco Pazienti</span>
          </button>

          <button
            onClick={() => onNavigate("nuovo")}
            className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition flex flex-col items-center gap-3"
          >
            <UserPlus className="w-10 h-10 text-blue-600" />
            <span className="text-lg font-semibold">Nuovo Paziente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
