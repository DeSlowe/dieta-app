import { DietProvider, useDiet } from "../context/DietContext";
import { MEAL_LABELS, MealType } from "../models/Food";
import MealSection from "../components/diet/MealSection";
import SummaryPanel from "../components/diet/SummaryPanel";

function DashboardContent() {
  const { meals, addFood, removeItem, updateQuantity } = useDiet();
  const mealOrder: MealType[] = ["colazione", "spuntino1", "pranzo", "spuntino2", "cena"];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-6">Dieta di oggi</h1>
          {mealOrder.map((meal) => (
            <MealSection
              key={meal}
              title={MEAL_LABELS[meal]}
              items={meals[meal]}
              onQuantityChange={(id, qty) => updateQuantity(meal, id, qty)}
              onRemove={(id) => removeItem(meal, id)}
              onAddFood={(food) => addFood(meal, food)}
            />
          ))}
        </div>

        <div>
          <SummaryPanel />
        </div>
      </div>
    </div>
  );
}

export default function DietDashboard() {
  return (
    <DietProvider>
      <DashboardContent />
    </DietProvider>
  );
}
