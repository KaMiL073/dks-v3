// src/lib/categories.ts

// Mapowanie widocznych slugów (URL) -> faktyczne kolekcje Directus
export const categoriesMap: Record<string, string> = {
  "rozwiazania-dla-biura": "office_solutions",
  "rozwiazania-dla-poligrafii": "printing_solutions",
  "rozwiazania-wielkoformatowe": "large_format_solutions",
  "oprogramowanie-dla-biura": "office_software",
  "oprogramowanie-dla-poligrafii-i-cad-gis": "printing_software",
  "materialy-eksploatacyjne": "consumables",
  "kamery-termowizyjne": "thermal_imagers",
  "laptopy": "laptops",
  "komputery": "computers",
  "tablice-interaktywne": "multiboards",
  "drukarki": "printers",
  "urzadzenia-wielofunkcyjne": "multifunction_devices",
  "skanery": "scanners",
};