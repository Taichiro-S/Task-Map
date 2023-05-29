import { create } from 'zustand'

export type RFState = {}

const useStore = create<RFState>((set, get) => ({}))

export default useStore
