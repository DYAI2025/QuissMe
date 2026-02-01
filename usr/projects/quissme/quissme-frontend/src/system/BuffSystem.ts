// system/BuffSystem.ts - Buff State Management

import { create } from 'zustand';

export type BuffType = 
  | 'Liebesflüsterer'
  | 'Harmonie-Welle'
  | 'Versöhnungs-Kraft'
  | 'Neugier-Funkeln'
  | 'Intimitäts-Boost'
  | 'Wert-Schärfer';

export interface Buff {
  id: string;
  type: BuffType;
  description: string;
  effect: string;
  durationDays: number;
  startDate: Date;
  expiryDate: Date;
  icon: string;
  percentageBoost: number;
}

export interface BuffState {
  activeBuffs: Buff[];
  addBuff: (buff: Buff) => void;
  removeBuff: (buffId: string) => void;
  getActiveBuffs: () => Buff[];
  hasBuffType: (type: BuffType) => boolean;
  getBuffEffect: (type: BuffType) => number;
}

const BUFF_DEFINITIONS: Record<BuffType, Omit<Buff, 'id' | 'startDate' | 'expiryDate'>> = {
  'Liebesflüsterer': {
    type: 'Liebesflüsterer',
    description: 'Enhanced empathy and listening skills',
    effect: '+15% Empathie',
    durationDays: 7,
    icon: '💬',
    percentageBoost: 15
  },
  'Harmonie-Welle': {
    type: 'Harmonie-Welle',
    description: 'Reduced conflicts, increased patience',
    effect: '-Konflikte, +Geduld',
    durationDays: 3,
    icon: '🌊',
    percentageBoost: 20
  },
  'Versöhnungs-Kraft': {
    type: 'Versöhnungs-Kraft',
    description: 'Quick recovery after conflicts',
    effect: 'Schneller Reset nach Streit',
    durationDays: 1,
    icon: '🕊️',
    percentageBoost: 25
  },
  'Neugier-Funkeln': {
    type: 'Neugier-Funkeln',
    description: 'Better question asking, less assumptions',
    effect: '+Fragen stellen, -Assumieren',
    durationDays: 7,
    icon: '✨',
    percentageBoost: 18
  },
  'Intimitäts-Boost': {
    type: 'Intimitäts-Boost',
    description: 'Enhanced physical and emotional closeness',
    effect: '+Körperliche Nähe',
    durationDays: 7,
    icon: '💕',
    percentageBoost: 22
  },
  'Wert-Schärfer': {
    type: 'Wert-Schärfer',
    description: 'Clearer priorities and values alignment',
    effect: 'Klarere Prioritäten',
    durationDays: 14,
    icon: '🎯',
    percentageBoost: 20
  }
};

export const useBuffStore = create<BuffState>((set, get) => ({
  activeBuffs: [],

  addBuff: (buff: Buff) => {
    set((state) => ({
      activeBuffs: [...state.activeBuffs, buff]
    }));
  },

  removeBuff: (buffId: string) => {
    set((state) => ({
      activeBuffs: state.activeBuffs.filter(b => b.id !== buffId)
    }));
  },

  getActiveBuffs: () => {
    const state = get();
    const now = new Date();
    return state.activeBuffs.filter(buff => buff.expiryDate > now);
  },

  hasBuffType: (type: BuffType) => {
    const activeBuffs = get().getActiveBuffs();
    return activeBuffs.some(buff => buff.type === type);
  },

  getBuffEffect: (type: BuffType) => {
    const activeBuffs = get().getActiveBuffs();
    const buff = activeBuffs.find(b => b.type === type);
    return buff ? buff.percentageBoost : 0;
  }
}));

export function createBuff(type: BuffType): Buff {
  const definition = BUFF_DEFINITIONS[type];
  const startDate = new Date();
  const expiryDate = new Date(startDate.getTime() + definition.durationDays * 24 * 60 * 60 * 1000);

  return {
    id: `buff_${Date.now()}_${Math.random()}`,
    ...definition,
    startDate,
    expiryDate
  };
}
