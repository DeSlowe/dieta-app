import { DietItem } from "../models/Food";

export type Totals = {
  kcal: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
};

export const zeroTotals: Totals = { kcal: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 };

export function computeTotals(items: DietItem[]): Totals {
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
