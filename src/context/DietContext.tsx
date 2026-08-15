import { createContext, useContext, useState, ReactNode } from "react";
import { Food, DietItem, MealType } from "../models/Food";

type MealsState = Record<MealType, DietItem[]>;

type Totals = {
  kcal: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
};

type DietContextValue = {
  meals: MealsState;
  addFood: (meal: MealType, food: Food) => void;
  removeItem: (meal: MealType, id: string) => void;
  updateQuantity: (meal: MealType, id: string, quantity: number) => void;
  getMealTotals: (meal: MealType) => Totals;
  getDayTotals: () => Totals;
  targets: Totals;
  setTargets: (t: Totals) => void;
};

const emptyMeals: MealsState = {
  colazione: [],
  spuntino1: [],
  pranzo: [],
  spuntino2: [],
  cena: [],
};

const zeroTotals: Totals = { kcal: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 };

const DietContext = createContext<DietContextValue | null>(null);

function computeTotals(items: DietItem[]): Totals {
  return items.reduce((acc, item) => {
    const factor = item.quantity / 100;
    return {
      kcal: acc.kcal + item.food.energy_kcal * factor,
      proteins: acc.proteins + item.food.proteins * factor,
      carbs: acc.carbs + item.food.available_carbohydrates * factor,
      fats: acc.fats + item.food.lipids * factor,
      fiber: acc.fiber + item.food.total_fiber * factor,
    };
  }, { ...zeroTotals });
}

export function DietProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<MealsState>(emptyMeals);
  const [targets, setTargets] = useState<Totals>({
    kcal: 2000,
    proteins: 120,
    carbs: 220,
    fats: 65,
    fiber: 30,
  });

  const addFood = (meal: MealType, food: Food) => {
    setMeals((prev) => ({
      ...prev,
      [meal]: [
        ...prev[meal],
        { id: crypto.randomUUID(), food, quantity: food.portion },
      ],
    }));
  };

  const removeItem = (meal: MealType, id: string) => {
    setMeals((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((i) => i.id !== id),
    }));
  };

  const updateQuantity = (meal: MealType, id: string, quantity: number) => {
    setMeals((prev) => ({
      ...prev,
      [meal]: prev[meal].map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  };

  const getMealTotals = (meal: MealType) => computeTotals(meals[meal]);

  const getDayTotals = () => {
    const all = Object.values(meals).flat();
    return computeTotals(all);
  };

  return (
    <DietContext.Provider
      value={{
        meals,
        addFood,
        removeItem,
        updateQuantity,
        getMealTotals,
        getDayTotals,
        targets,
        setTargets,
      }}
    >
      {children}
    </DietContext.Provider>
  );
}

export function useDiet() {
  const ctx = useContext(DietContext);
  if (!ctx) throw new Error("useDiet must be used within DietProvider");
  return ctx;
}
