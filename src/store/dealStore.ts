import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Deal, Stage, LostReason, Note } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Stage IDs constants
export const STAGE_IDS = {
  LEAD: 'lead',
  CONTACT: 'contact-made',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  CLOSED_WON: 'closed-won',
  CLOSED_LOST: 'closed-lost'
} as const;

// Initial stages
const initialStages: Stage[] = [
  { id: STAGE_IDS.LEAD, name: 'Lead', deals: [] },
  { id: STAGE_IDS.CONTACT, name: 'Contact Made', deals: [] },
  { id: STAGE_IDS.PROPOSAL, name: 'Proposal', deals: [] },
  { id: STAGE_IDS.NEGOTIATION, name: 'Negotiation', deals: [] },
  { id: STAGE_IDS.CLOSED_WON, name: 'Closed Won', deals: [] },
  { id: STAGE_IDS.CLOSED_LOST, name: 'Closed Lost', deals: [] }
];

// Sample deals
const sampleDeals: Deal[] = [
  {
    id: '1',
    title: 'Enterprise Software Solution',
    company: 'Acme Corp',
    contact: 'John Smith',
    contactId: '1',
    value: 50000,
    probability: 60,
    stage: STAGE_IDS.PROPOSAL,
    expectedCloseDate: '2024-12-31',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Cloud Migration Project',
    company: 'Tech Inc',
    contact: 'Jane Doe',
    contactId: '2',
    value: 75000,
    probability: 40,
    stage: STAGE_IDS.LEAD,
    expectedCloseDate: '2024-11-30',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface DealStore {
  deals: Deal[];
  stages: Stage[];
  notes: Note[];
  viewMode: 'kanban' | 'list';
  showArchived: boolean;
  lostReasons: LostReason[];
  setViewMode: (mode: 'kanban' | 'list') => void;
  setShowArchived: (show: boolean) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  moveDeal: (dealId: string, fromStage: string, toStage: string, targetDealId?: string, insertBefore?: boolean) => void;
  markAsWon: (dealId: string) => void;
  markAsLost: (dealId: string, reason: LostReason) => void;
  reopenDeal: (dealId: string) => void;
  archiveDeal: (dealId: string) => void;
  unarchiveDeal: (dealId: string) => void;
  deleteDeal: (dealId: string) => void;
  addStage: (stage: Stage) => void;
  updateStage: (id: string, name: string) => void;
  deleteStage: (id: string) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

export const useDealStore = create<DealStore>()(
  persist(
    (set, get) => ({
      deals: sampleDeals,
      stages: initialStages,
      notes: [],
      viewMode: 'kanban',
      showArchived: false,
      lostReasons: [],

      setViewMode: (mode) => set({ viewMode: mode }),
      setShowArchived: (show) => set({ showArchived: show }),

      addDeal: (deal) =>
        set((state) => ({
          deals: [...state.deals, deal],
        })),

      updateDeal: (id, updates) =>
        set((state) => ({
          deals: state.deals.map((deal) =>
            deal.id === id
              ? { ...deal, ...updates, updatedAt: new Date().toISOString() }
              : deal
          ),
        })),

      moveDeal: (dealId, fromStage, toStage, targetDealId, insertBefore = false) =>
        set((state) => {
          const updatedDeals = [...state.deals];
          const dealIndex = updatedDeals.findIndex(d => d.id === dealId);
          const deal = updatedDeals[dealIndex];

          if (!deal) return state;

          updatedDeals.splice(dealIndex, 1);

          let targetIndex;
          if (targetDealId) {
            targetIndex = updatedDeals.findIndex(d => d.id === targetDealId);
            if (!insertBefore) targetIndex++;
          } else {
            targetIndex = updatedDeals.length;
          }

          updatedDeals.splice(targetIndex, 0, {
            ...deal,
            stage: toStage,
            previousStage: fromStage,
            updatedAt: new Date().toISOString()
          });

          return { deals: updatedDeals };
        }),

      markAsWon: (dealId) =>
        set((state) => ({
          deals: state.deals.map((deal) =>
            deal.id === dealId
              ? {
                  ...deal,
                  stage: STAGE_IDS.CLOSED_WON,
                  status: 'won',
                  probability: 100,
                  updatedAt: new Date().toISOString(),
                }
              : deal
          ),
        })),

      markAsLost: (dealId, reason) =>
        set((state) => ({
          deals: state.deals.map((deal) =>
            deal.id === dealId
              ? {
                  ...deal,
                  stage: STAGE_IDS.CLOSED_LOST,
                  status: 'lost',
                  probability: 0,
                  updatedAt: new Date().toISOString(),
                }
              : deal
          ),
          lostReasons: [...state.lostReasons, reason],
        })),

      reopenDeal: (dealId) =>
        set((state) => ({
          deals: state.deals.map((deal) =>
            deal.id === dealId
              ? {
                  ...deal,
                  stage: deal.previousStage || STAGE_IDS.LEAD,
                  status: undefined,
                  updatedAt: new Date().toISOString(),
                }
              : deal
          ),
        })),

      archiveDeal: (dealId) =>
        set((state) => ({
          deals: state.deals.map((deal) =>
            deal.id === dealId
              ? {
                  ...deal,
                  isArchived: true,
                  archivedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : deal
          ),
        })),

      unarchiveDeal: (dealId) =>
        set((state) => ({
          deals: state.deals.map((deal) =>
            deal.id === dealId
              ? {
                  ...deal,
                  isArchived: false,
                  archivedAt: undefined,
                  updatedAt: new Date().toISOString(),
                }
              : deal
          ),
        })),

      deleteDeal: (dealId) =>
        set((state) => ({
          deals: state.deals.filter((deal) => deal.id !== dealId),
        })),

      addStage: (stage) =>
        set((state) => ({
          stages: [...state.stages, stage],
        })),

      updateStage: (id, name) =>
        set((state) => ({
          stages: state.stages.map((stage) =>
            stage.id === id ? { ...stage, name } : stage
          ),
        })),

      deleteStage: (id) =>
        set((state) => ({
          stages: state.stages.filter((stage) => stage.id !== id),
        })),

      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
    }),
    {
      name: 'deal-store',
      version: 1,
    }
  )
);