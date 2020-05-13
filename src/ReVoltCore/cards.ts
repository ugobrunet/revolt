import { Card, CardIconsKeys as Icons } from "./Card";

export type CardIcons<T> = Record<Icons, T>;

const Cards: Card[] = [];
Cards.push(
  new Card(
    Icons.Shower,
    "DOUCHE CHAUDE",
    "10 minutes - 60 litres",
    "pour 10 minutes de",
    63,
    "1 JOUR et 18 HEURES",
    2100
  ),
  new Card(
    Icons.Bath,
    "BAIN",
    "200 litres",
    "pour un",
    75,
    "5 JOURS et 19 HEURES",
    7000
  ),
  new Card(
    Icons.Heater,
    "RADIATEUR ÉLECTRIQUE",
    "24 heures",
    "pour 24 heures de",
    90,
    "20 JOURS",
    24000
  ),
  new Card(
    Icons.Fridge,
    "RÉFRIGÉRATEUR",
    "24 heures",
    "pour 24 heures de",
    42,
    "8 HEURES",
    400
  ),
  new Card(
    Icons.Extractor,
    "HOTTE ASPIRANTE",
    "30 minutes",
    "pour 30 minutes de",
    23,
    "1 HEURE et 30 MINUTES",
    75
  ),
  new Card(
    Icons.Blender,
    "BLENDER",
    "5 minutes",
    "pour 5 minutes de",
    22,
    "1 HEURE et 20 MINUTES",
    70
  ),
  new Card(
    Icons.MicroWave,
    "PLAT AU MICRO-ONDES",
    "5 minutes",
    "pour 5 minutes de",
    23,
    "1 HEURE et 30 MINUTES",
    75
  ),
  new Card(
    Icons.Toaster,
    "DEUX TARTINES GRILLÉES",
    null,
    "pour",
    14,
    "30 MINUTES",
    25
  ),
  new Card(
    Icons.DishWasher,
    "LAVE-VAISSELLE",
    "cycle éco",
    "pour un cycle éco de",
    47,
    "13 HEURES",
    650
  ),
  new Card(
    Icons.DishWasher,
    "LAVE-VAISSELLE",
    "cycle rapide",
    "pour un cycle rapide de",
    53,
    "20 HEURES",
    1000
  ),
  new Card(Icons.Boiler, "TASSE DE THÉ", null, "pour une", 20, "1 HEURE", 50),
  new Card(
    Icons.Cooker,
    "PLAT DE PATES",
    "15 minutes",
    "pour cuire (15min) un",
    45,
    "10 HEURES",
    500
  ),
  new Card(
    Icons.Cooker,
    "BOEUF BOURGUIGNON",
    "3 heures",
    "pour cuisiner (3h) un",
    65,
    "2 JOURS et 12 HEURES",
    3000
  ),
  new Card(
    Icons.Oven,
    "POULET AU FOUR",
    "2 heures - 200°C",
    "pour cuire (2h - 240°C) un",
    70,
    "3 JOURS et 8 HEURES",
    4000
  ),
  new Card(
    Icons.Fan,
    "VENTILATEUR",
    "24 heures",
    "pour 24 heures de",
    57,
    "24 HEURES",
    1200
  ),
  new Card(
    Icons.AirCooler,
    "CLIMATISEUR",
    "24 heures",
    "pour 24 heures de",
    100,
    "60 JOURS",
    72000
  ),
  new Card(
    Icons.Sewing,
    "MACHINE À COUDRE",
    "15 minutes",
    "pour 15 minutes de",
    12,
    "30 MINUTES",
    25
  ),
  new Card(
    Icons.Vacuum,
    "ASPIRATEUR",
    "15 minutes",
    "pour 15 minutes de",
    30,
    "4 HEURES",
    200
  )
);

export default Cards;
