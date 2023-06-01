import { create } from 'zustand'

export type WorkspaceState = {}

const useFlowStore = create<WorkspaceState>((set, get) => ({}))

export default useFlowStore
