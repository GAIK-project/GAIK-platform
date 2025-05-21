import { create } from "zustand";

// Define the state and actions
interface CentralState {
  //variables
  customModel: string;
  baseModel: string;
  // count: number
  // isLoading: boolean
  // tasks: Task[]
  // statusMessage: string

  //actions
  setCustomModel: (customModel: string) => void;
  setBaseModel: (baseModel: string) => void;
  // increment: () => void
  // decrement: () => void
  // addTask: (task: Task) => void
  // removeTask: (id: number) => void
  // setIsLoading: (loading: boolean) => void
  // setStatusMessage: (message: string) => void
}

// Create the store
const useStore = create<CentralState>((set) => ({
  //variables
  customModel: "none",
  baseModel: "gpt-4o",
  // count: 0,
  // tasks: [],
  // isLoading: false,
  // statusMessage: '',

  //actions
  setCustomModel: (customModel) => set(() => ({ customModel: customModel })),

  setBaseModel: (baseModel) => set(() => ({ baseModel: baseModel })),

  // addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  // removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id),})),

  // setIsLoading: (loading) => set(() => ({ isLoading: loading })),

  // setStatusMessage: (message) => set(() => ({ statusMessage: message })),

  // increment: () => set((state) => ({ count: state.count + 1 })),

  // decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;
