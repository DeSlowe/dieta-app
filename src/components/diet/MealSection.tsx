import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { DietItem } from "../../models/Food";
import FoodSearchInline from "./FoodSearchInline";
import { Food } from "../../models/Food";

type Props = {
  title: string;
  items: DietItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onAddFood: (food: Food) => void;
};

export default function MealSection({
  title,
  items,
  onQuantityChange,
  onRemove,
  onAddFood,
}: Props) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow mb-6">
      <div className="bg-slate-100 border-b px-4 py-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-3 text-left">Alimento</th>
              <th className="p-3 text-center">Porzione (g)</th>
              <th className="p-3 text-center">Kcal</th>
              <th className="p-3 text-center">Prot.</th>
              <th className="p-3 text-center">Carb.</th>
              <th className="p-3 text-center">Grassi</th>
              <th className="p-3 text-center">Fibre</th>
              <th className="p-3 text-center w-12"></th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-400">
                  Nessun alimento inserito
                </td>
              </tr>
            )}

            {items.map((item) => {
              const factor = item.quantity / 100;
              const kcal = item.food.energy_kcal * factor;
              const protein = item.food.proteins * factor;
              const carbs = item.food.available_carbohydrates * factor;
              const fat = item.food.lipids * factor;
              const fiber = item.food.total_fiber * factor;

              return (
                <tr key={item.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-medium">{item.food.name}</td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) =>
                        onQuantityChange(item.id, Number(e.target.value))
                      }
                      className="w-20 px-2 py-1 border rounded-lg text-center"
                    />
                  </td>
                  <td className="p-3 text-center">{kcal.toFixed(0)}</td>
                  <td className="p-3 text-center">{protein.toFixed(1)}</td>
                  <td className="p-3 text-center">{carbs.toFixed(1)}</td>
                  <td className="p-3 text-center">{fat.toFixed(1)}</td>
                  <td className="p-3 text-center">{fiber.toFixed(1)}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Cerca alimento
        </button>

        {showSearch && (
          <div className="mt-4">
            <FoodSearchInline
              onSelect={(food) => {
                onAddFood(food);
                setShowSearch(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
