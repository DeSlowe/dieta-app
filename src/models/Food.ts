// Alimento come da dataset (valori per 100g)
export type Food = {
  name: string;
  portion: number; // porzione standard in grammi (dataset)
  energy_kcal: number;
  proteins: number;
  lipids: number;
  available_carbohydrates: number;
  total_fiber: number;
  sodium: number;
};

// Riga inserita in un pasto (porzione editabile dall'utente)
export type DietItem = {
  id: string;
  food: Food;
  quantity: number; // grammi effettivi, default = food.portion
};

export type MealType = "colazione" | "spuntino1" | "pranzo" | "spuntino2" | "cena";

export const MEAL_LABELS: Record<MealType, string> = {
  colazione: "Colazione",
  spuntino1: "Spuntino",
  pranzo: "Pranzo",
  spuntino2: "Spuntino",
  cena: "Cena",
};

export type MealsState = Record<MealType, DietItem[]>;

export function emptyMeals(): MealsState {
  return {
    colazione: [],
    spuntino1: [],
    pranzo: [],
    spuntino2: [],
    cena: [],
  };
}

// Un giorno di dieta compilato (Giorno 1, Giorno 2, ...)
export type DietDay = {
  id: string;
  label: string;
  meals: MealsState;
};

