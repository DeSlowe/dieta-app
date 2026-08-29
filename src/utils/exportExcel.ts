import * as XLSX from "xlsx";
import { Patient } from "../models/Patient";
import { MEAL_LABELS, MealType } from "../models/Food";
import { verifyPermission } from "./folderStorage";

function sanitizeSheetName(name: string) {
  return name.replace(/[\\/?*[\]:]/g, "-").slice(0, 31);
}

function buildWorkbook(patient: Patient): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  const anagraficaRows = [
    ["Nome", patient.nome],
    ["Cognome", patient.cognome],
    ["Età", patient.eta],
    ["Peso (kg)", patient.peso],
    ["Altezza (cm)", patient.altezza],
    ["Target Kcal", patient.targets.kcal],
    ["Target Proteine (g)", patient.targets.proteins],
    ["Target Carboidrati (g)", patient.targets.carbs],
    ["Target Grassi (g)", patient.targets.fats],
    ["Target Fibre (g)", patient.targets.fiber],
    ["Data creazione anagrafica", new Date(patient.createdAt).toLocaleDateString("it-IT")],
  ];
  const wsAnagrafica = XLSX.utils.aoa_to_sheet(anagraficaRows);
  XLSX.utils.book_append_sheet(wb, wsAnagrafica, "Anagrafica");

  const dietRows: (string | number)[][] = [
    ["Giorno", "Pasto", "Alimento", "Porzione (g)", "Kcal", "Proteine (g)", "Carboidrati (g)", "Grassi (g)", "Fibre (g)"],
  ];

  patient.days.forEach((day) => {
    (Object.keys(day.meals) as MealType[]).forEach((mealKey) => {
      day.meals[mealKey].forEach((item) => {
        const factor = item.quantity / 100;
        dietRows.push([
          day.label,
          MEAL_LABELS[mealKey],
          item.food.name,
          item.quantity,
          Number((item.food.energy_kcal * factor).toFixed(0)),
          Number((item.food.proteins * factor).toFixed(1)),
          Number((item.food.available_carbohydrates * factor).toFixed(1)),
          Number((item.food.lipids * factor).toFixed(1)),
          Number((item.food.total_fiber * factor).toFixed(1)),
        ]);
      });
    });
  });

  const dietDate = new Date(patient.dietCreatedAt).toLocaleDateString("it-IT").replace(/\//g, "-");
  const sheetName = sanitizeSheetName(`Dieta_${dietDate}`);
  const wsDieta = XLSX.utils.aoa_to_sheet(dietRows);
  XLSX.utils.book_append_sheet(wb, wsDieta, sheetName);

  return wb;
}

export type ExportResult = { savedTo: "folder" | "download"; fileName: string };

export async function exportPatientToExcel(
  patient: Patient,
  folderHandle?: FileSystemDirectoryHandle | null
): Promise<ExportResult> {
  const wb = buildWorkbook(patient);
  const fileName = `${patient.cognome}_${patient.nome}_dieta.xlsx`.replace(/\s+/g, "_");

  if (folderHandle) {
    const ok = await verifyPermission(folderHandle, true, true);
    if (ok) {
      const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(arrayBuffer);
      await writable.close();
      return { savedTo: "folder", fileName };
    }
  }

  // Fallback: nessuna cartella scelta o permesso negato -> download normale del browser
  XLSX.writeFile(wb, fileName);
  return { savedTo: "download", fileName };
}
