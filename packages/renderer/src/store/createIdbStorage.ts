import { del, get, set } from "idb-keyval";
import type { PersistStorage, StorageValue } from "zustand/middleware";

export const createIdbStorage = <S>(): PersistStorage<S> => ({
  getItem: async (name: string): Promise<StorageValue<S> | null> => {
    const value = await get<StorageValue<S>>(name);
    return value ?? null;
  },
  setItem: async (name: string, value: StorageValue<S>): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
});
