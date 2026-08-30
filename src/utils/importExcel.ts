import * as XLSX from "xlsx";
import foodsData from "../data/foods.json";
import { Food, DietDay, MealType, emptyMeals } from "../models/Food";

const VALID_MEAL_KEYS: MealType[] = ["colazione", "spuntino1", "pranzo", "spuntino2", "cena"];

function findFoodByName(name: string): Food | null {
  const foods = foodsData as Food[];
  return foods.find((f) => f.name.toLowerCase() === name.trim().toLowerCase()) ?? null;
}

// Se l'alimento non è più nel dataset corrente, ricostruiamo un Food "sintetico"
// facendo il percorso inverso: dai valori già scalati sulla porzione, risaliamo
// ai valori per 100g. Il sodio non è esportato, quindi resta a 0 (non influisce
// sull'interfaccia, che non lo mostra).
function reconstructFood(
  name: string,
  quantity: number,
  kcal: number,
  proteins: number,
  carbs: number,
  fats: number,
  fiber: number
): Food {
  const factor = quantity > 0 ? 100 / quantity : 0;
  return {
    name,
    portion: quantity,
    energy_kcal: kcal * factor,
    proteins: proteins * factor,
    lipids: fats * factor,
    available_carbohydrates: carbs * factor,
    total_fiber: fiber * factor,
    sodium: 0,
  };
}

export class ImportError extends Error {}

export async function parseDietExcel(file: File): Promise<DietDay[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });

  const dietSheetName = wb.SheetNames.find((n) => n.startsWith("Dieta_"));
  if (!dietSheetName) {
    throw new ImportError("Il file non contiene un foglio 'Dieta_...': non sembra un export valido di questa app.");
  }

  const sheet = wb.Sheets[dietSheetName];
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1 });
  const [header, ...dataRows] = rows;

  if (!header) {
    throw new ImportError("Foglio 'Dieta' vuoto o non leggibile.");
  }

  const col = (name: string) => header.indexOf(name);
  const idx = {
    giorno: col("Giorno"),
    chiavePasto: col("Chiave Pasto"),
    alimento: col("Alimento"),
    porzione: col("Porzione (g)"),
    kcal: col("Kcal"),
    proteine: col("Proteine (g)"),
    carboidrati: col("Carboidrati (g)"),
    grassi: col("Grassi (g)"),
    fibre: col("Fibre (g)"),
  };

  if (idx.chiavePasto === -1) {
    throw new ImportError(
      "Questo file è stato esportato con una versione precedente dell'app (manca la colonna 'Chiave Pasto') e non può essere reimportato correttamente. Ri-esporta la dieta con la versione aggiornata."
    );
  }

  const daysMap = new Map<string, DietDay>();

  for (const row of dataRows) {
    if (!row || row.length === 0) continue;

    const giorno = String(row[idx.giorno] ?? "").trim();
    const mealKey = String(row[idx.chiavePasto] ?? "").trim() as MealType;
    const alimento = String(row[idx.alimento] ?? "").trim();
    if (!giorno || !alimento || !VALID_MEAL_KEYS.includes(mealKey)) continue;

    const porzione = Number(row[idx.porzione]) || 0;
    const kcal = Number(row[idx.kcal]) || 0;
    const proteine = Number(row[idx.proteine]) || 0;
    const carboidrati = Number(row[idx.carboidrati]) || 0;
    const grassi = Number(row[idx.grassi]) || 0;
    const fibre = Number(row[idx.fibre]) || 0;

    if (!daysMap.has(giorno)) {
      daysMap.set(giorno, { id: crypto.randomUUID(), label: giorno, meals: emptyMeals() });
    }
    const day = daysMap.get(giorno)!;

    const food =
      findFoodByName(alimento) ??
      reconstructFood(alimento, porzione, kcal, proteine, carboidrati, grassi, fibre);

    day.meals[mealKey].push({
      id: crypto.randomUUID(),
      food,
      quantity: porzione,
    });
  }

  if (daysMap.size === 0) {
    throw new ImportError("Nessun dato valido trovato nel foglio Dieta.");
  }

  return Array.from(daysMap.values());
}
