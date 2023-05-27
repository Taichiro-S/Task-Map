import { NewWorkspace } from 'types/types'
import { create } from 'zustand'

export type RFState = {
  newWorkspace: NewWorkspace
  setNewWorkspace: (newWorkspace: NewWorkspace) => void
  resetNewWorkspace: () => void
}

const useStore = create<RFState>((set, get) => ({
  newWorkspace: {
    title: '',
    description: '',
  },
  setNewWorkspace: (newWorkspace) =>
    set({ newWorkspace: { title: newWorkspace.title, description: newWorkspace.description } }),
  resetNewWorkspace: () => set({ newWorkspace: { title: '', description: '' } }),
}))

export default useStore
