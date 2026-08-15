import { DietDay } from "./Food";

export type DietTargets = {
  kcal: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
};

export type Patient = {
  id: string;
  nome: string;
  cognome: string;
  eta: number;
  peso: number;
  altezza: number;
  targets: DietTargets;
  createdAt: string; // data creazione anagrafica
  dietCreatedAt: string; // data creazione dieta, usata per nominare lo sheet Excel
  days: DietDay[];
};
