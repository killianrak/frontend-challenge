import type { GameTypeOption, ActionTypeOption, GiftCategoryOption, Campaign, Profile } from '../types/types';

export const GAME_TYPES: GameTypeOption[] = [
  { value: "WHEEL", label: "ROUE DE LA FORTUNE", color: "#4285F4", icon: "🎡" },
  { value: "MYSTERY", label: "LES BOÎTES MYSTÈRES", color: "#FF9800", icon: "📦" },
  { value: "SLOT_MACHINE", label: "MACHINE À SOUS", color: "#9C27B0", icon: "🎰" },
  { value: "CARD", label: "JEU DE CARTES", color: "#2196F3", icon: "🃏" }
];

export const ACTION_TYPES: ActionTypeOption[] = [
  { value: "GOOGLE_REVIEW", label: "Avis Google", icon: "⭐" },
  { value: "INSTAGRAM", label: "Instagram", icon: "📷" },
  { value: "FACEBOOK", label: "Facebook", icon: "📘" },
  { value: "TIKTOK", label: "TikTok", icon: "🎵" }
];

export const GIFT_CATEGORIES: GiftCategoryOption[] = [
  { value: "EAT", label: "Nourriture" },
  { value: "DRINK", label: "Boisson" },
  { value: "DISCOUNT", label: "Réduction" },
  { value: "LOSS", label: "Perte" }
];

export const createDefaultCampaign = (profile: Profile): Campaign => ({
  id: "1",
  profile: profile,
  configuration: {
    actions: [
      {
        id: "1",
        priority: 1,
        target: "https://google.com/biz",
        type: "GOOGLE_REVIEW"
      }
    ],
    colors: {
      primary: "#4285F4",
      secondary: "#FF9800"
    },
    disabled: false,
    game_type: "WHEEL",
    gifts: [
      {
        id: "1",
        icon: "🍟",
        initial_limit: 15,
        limit: 15,
        name: "Frite",
        type: "EAT"
      }
    ],
    retrievalConditions: [
      {
        id: "1",
        name: "Frite",
        value: "Aucune"
      }
    ],
    logo_uri: ""
  },
  created_at: "2025-01-01",
  created_by: "user",
  enabled: true,
  label: "Ma Campagne",
  placeId: "place1",
  updated_at: "2025-01-01",
  updated_by: "user"
});

export const validateHexColor = (value: string): string | true => {
  return /^#[0-9A-F]{6}$/i.test(value) || "Format hexadécimal requis (#RRGGBB)";
};