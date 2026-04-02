export interface Product {
  name: "MAC System" | "HeelPOD" | "ELEVATE";
  arr: number;
  closeDate?: string;
  status: string;
}

export interface Hospital {
  id: string;
  name: string;
  idn: string;
  location: string;
  totalArr: number;
  products: Product[];
}

export const hospitals: Hospital[] = [
  {
    id: "1",
    name: "NYU Langone Tisch Hospital",
    idn: "NYU Langone Health",
    location: "New York, NY",
    totalArr: 283,
    products: [
      {
        name: "MAC System",
        arr: 195,
        closeDate: "Jan 20, 2026",
        status: "Implemented",
      },
      {
        name: "HeelPOD",
        arr: 88,
        closeDate: "Jan 20, 2026",
        status: "Implemented",
      },
    ],
  },
  {
    id: "2",
    name: "AdventHealth Orlando",
    idn: "AdventHealth",
    location: "Orlando, FL",
    totalArr: 280,
    products: [
      {
        name: "MAC System",
        arr: 185,
        closeDate: "Mar 5, 2026",
        status: "Trial",
      },
      {
        name: "HeelPOD",
        arr: 95,
        closeDate: "Feb 25, 2026",
        status: "Pending Decision",
      },
    ],
  },
  {
    id: "3",
    name: "St. Joseph Medical Center",
    idn: "CommonSpirit Health",
    location: "Webster, TX",
    totalArr: 234,
    products: [
      { name: "ELEVATE", arr: 145, closeDate: "Mar 15, 2026", status: "CPA" },
      {
        name: "MAC System",
        arr: 89,
        closeDate: "Apr 1, 2026",
        status: "Committee",
      },
    ],
  },
  {
    id: "4",
    name: "VA Palo Alto Health Care System",
    idn: "VA",
    location: "Palo Alto, CA",
    totalArr: 225,
    products: [
      {
        name: "MAC System",
        arr: 225,
        closeDate: "Mar 25, 2026",
        status: "Demo",
      },
    ],
  },
  {
    id: "5",
    name: "North Shore University Hospital",
    idn: "Northwell Health",
    location: "Manhasset, NY",
    totalArr: 263,
    products: [
      {
        name: "ELEVATE",
        arr: 98,
        closeDate: "Jun 1, 2026",
        status: "Intro Call/Demo",
      },
      {
        name: "MAC System",
        arr: 165,
        closeDate: "Jun 15, 2026",
        status: "Intro Call/Demo",
      },
    ],
  },
  {
    id: "6",
    name: "Cleveland Clinic Main Campus",
    idn: "Cleveland Clinic",
    location: "Cleveland, OH",
    totalArr: 175,
    products: [
      {
        name: "ELEVATE",
        arr: 175,
        closeDate: "No close date set",
        status: "Lost",
      },
    ],
  },
];
