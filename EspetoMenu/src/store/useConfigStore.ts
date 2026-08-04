import { create } from "zustand";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { products as defaultProducts, categories as defaultCategories } from "@/data/products";
import type { Product } from "@/data/products";

export interface ConfigState {
  storeName: string;
  whatsappNumber: string;
  deliveryFee: number;
  openTime: string;
  closeTime: string;
  pixKey: string;
}

interface ConfigStore extends ConfigState {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  
  fetchConfig: () => Promise<void>;
  updateConfig: (updates: Partial<ConfigState>) => Promise<void>;

  setDeliveryFee: (fee: number) => void;
  updateProductPrice: (id: string, price: number) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  resetToDefaults: () => void;
}

const defaultSettings: ConfigState = {
  storeName: "Espeto Fácil Menu",
  whatsappNumber: "5575981209727",
  deliveryFee: 5.0,
  openTime: "00:00",
  closeTime: "23:59",
  pixKey: "",
};

export const useConfigStore = create<ConfigStore>()((set) => ({
  ...defaultSettings,
  products: defaultProducts,
  categories: defaultCategories,
  isLoading: true,

  fetchConfig: async () => {
    try {
      const docRef = doc(db, "settings", "global");
      
      // Criar um timeout de 1.5 segundos para não deixar a interface bloqueada
      const fetchPromise = getDoc(docRef);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("timeout")), 1500)
      );

      try {
        const docSnap = await Promise.race([fetchPromise, timeoutPromise]) as any;
        if (docSnap.exists()) {
          const data = docSnap.data();
          set({
            storeName: data.storeName ?? defaultSettings.storeName,
            whatsappNumber: data.whatsappNumber ?? defaultSettings.whatsappNumber,
            deliveryFee: data.deliveryFee ?? defaultSettings.deliveryFee,
            openTime: data.openTime ?? defaultSettings.openTime,
            closeTime: data.closeTime ?? defaultSettings.closeTime,
            pixKey: data.pixKey ?? defaultSettings.pixKey,
            isLoading: false,
          });
        } else {
          await setDoc(docRef, defaultSettings);
          set({ ...defaultSettings, isLoading: false });
        }
      } catch (raceError: any) {
        if (raceError.message === "timeout") {
          console.warn("Aviso: O carregamento do Firebase demorou muito. Usando cache/padrões enquanto carrega em segundo plano.");
          set({ isLoading: false });
          // Deixa a promessa original continuar em segundo plano
          fetchPromise.then((docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              set({
                storeName: data.storeName ?? defaultSettings.storeName,
                whatsappNumber: data.whatsappNumber ?? defaultSettings.whatsappNumber,
                deliveryFee: data.deliveryFee ?? defaultSettings.deliveryFee,
                openTime: data.openTime ?? defaultSettings.openTime,
                closeTime: data.closeTime ?? defaultSettings.closeTime,
                pixKey: data.pixKey ?? defaultSettings.pixKey,
              });
            }
          }).catch(e => console.error("Erro no background fetch:", e));
        } else {
          throw raceError;
        }
      }
    } catch (error) {
      console.error("Erro ao buscar configurações no Firebase:", error);
      // Mantém os dados padrão localmente (fallback silencioso) em vez de crashar a store
      set({ isLoading: false });
    }
  },

  updateConfig: async (updates) => {
    try {
      const docRef = doc(db, "settings", "global");
      // @ts-ignore: updateDoc aceita chaves dinâmicas, o Partial é suficiente aqui
      await updateDoc(docRef, updates);
      set((state) => ({ ...state, ...updates }));
    } catch (error) {
      console.error("Erro ao atualizar configurações no Firebase:", error);
    }
  },

  setDeliveryFee: (fee) => set({ deliveryFee: fee }),

  updateProductPrice: (id, price) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, price } : p
      ),
    })),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: state.categories.includes(category)
        ? state.categories
        : [...state.categories, category],
    })),

  removeCategory: (category) =>
    set((state) => ({
      categories: state.categories.filter((c) => c !== category),
      products: state.products.filter((p) => p.category !== category),
    })),

  resetToDefaults: () =>
    set({
      products: defaultProducts,
      categories: defaultCategories,
      ...defaultSettings,
    }),
}));
