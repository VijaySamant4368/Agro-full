/** Cascading State → District → Sub-district options for the search bar. */
export const LOCATIONS: Record<string, Record<string, string[]>> = {
  Uttarakhand: {
    Nainital: ["Bhimtal", "Ramgarh", "Mukteshwar"],
    Chamoli: ["Joshimath", "Gopeshwar", "Karnaprayag"],
    Dehradun: ["Mussoorie", "Chakrata", "Rishikesh"],
  },
  Kerala: {
    Wayanad: ["Kalpetta", "Meppadi", "Sultan Bathery"],
    Idukki: ["Munnar", "Thekkady", "Vagamon"],
  },
  Rajasthan: {
    Jaipur: ["Amer", "Sanganer", "Chomu"],
    Udaipur: ["Girwa", "Gogunda"],
  },
  "Arunachal Pradesh": {
    "Lower Subansiri": ["Ziro", "Yachuli"],
    Tawang: ["Tawang", "Lumla"],
  },
};

export const STATES = Object.keys(LOCATIONS);

export const districtsOf = (state: string) =>
  state && LOCATIONS[state] ? Object.keys(LOCATIONS[state]) : [];

export const subDistrictsOf = (state: string, district: string) =>
  state && district ? (LOCATIONS[state]?.[district] ?? []) : [];
