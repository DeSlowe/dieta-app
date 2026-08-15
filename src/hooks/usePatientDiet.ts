import { usePatients } from "../context/PatientContext";
import { DietDay, Food, MealType, emptyMeals } from "../models/Food";

export function usePatientDiet(patientId: string) {
  const { getPatient, updatePatient } = usePatients();
  const patient = getPatient(patientId);

  const addDay = () => {
    updatePatient(patientId, (p) => {
      const day: DietDay = {
        id: crypto.randomUUID(),
        label: `Giorno ${p.days.length + 1}`,
        meals: emptyMeals(),
      };
      return { ...p, days: [...p.days, day] };
    });
  };

  const removeDay = (dayId: string) => {
    updatePatient(patientId, (p) => ({
      ...p,
      days: p.days.filter((d) => d.id !== dayId),
    }));
  };

  const addFood = (dayId: string, meal: MealType, food: Food) => {
    updatePatient(patientId, (p) => ({
      ...p,
      days: p.days.map((d) =>
        d.id === dayId
          ? {
              ...d,
              meals: {
                ...d.meals,
                [meal]: [
                  ...d.meals[meal],
                  { id: crypto.randomUUID(), food, quantity: food.portion },
                ],
              },
            }
          : d
      ),
    }));
  };

  const removeItem = (dayId: string, meal: MealType, itemId: string) => {
    updatePatient(patientId, (p) => ({
      ...p,
      days: p.days.map((d) =>
        d.id === dayId
          ? { ...d, meals: { ...d.meals, [meal]: d.meals[meal].filter((i) => i.id !== itemId) } }
          : d
      ),
    }));
  };

  const updateQuantity = (dayId: string, meal: MealType, itemId: string, quantity: number) => {
    updatePatient(patientId, (p) => ({
      ...p,
      days: p.days.map((d) =>
        d.id === dayId
          ? {
              ...d,
              meals: {
                ...d.meals,
                [meal]: d.meals[meal].map((i) => (i.id === itemId ? { ...i, quantity } : i)),
              },
            }
          : d
      ),
    }));
  };

  return { days: patient?.days ?? [], addDay, removeDay, addFood, removeItem, updateQuantity };
}
