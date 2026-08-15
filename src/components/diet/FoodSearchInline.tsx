import { useMemo, useState } from "react";
import foodsData from "../../data/foods.json";
import { Food } from "../../models/Food";

type Props = {
  onSelect: (food: Food) => void;
};

export default function FoodSearchInline({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const foods = foodsData as Food[];

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return foods.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, foods]);

  return (
    <div className="relative">
      <input
        autoFocus
        type="text"
        placeholder="Cerca alimento..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />

      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow max-h-64 overflow-y-auto">
          {results.map((food) => (
            <li
              key={food.name}
              onClick={() => onSelect(food)}
              className="px-3 py-2 hover:bg-slate-100 cursor-pointer flex justify-between"
            >
              <span>{food.name}</span>
              <span className="text-slate-400 text-sm">
                {food.energy_kcal} kcal/100g
              </span>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 p-3 text-slate-400 text-sm">
          Nessun risultato
        </div>
      )}
    </div>
  );
}
