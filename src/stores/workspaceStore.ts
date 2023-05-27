import { EditedWorkspace } from 'types/types'
import { create } from 'zustand'

export type RFState = {
  editedWorkspace: EditedWorkspace
  setEditedWorkspace: (editedWorkspace: EditedWorkspace) => void
  resetEditedWorkspace: () => void
}

const useStore = create<RFState>((set, get) => ({
  editedWorkspace: {
    id: '',
    title: '',
    description: '',
  },
  setEditedWorkspace: (workspaceData) => set({ editedWorkspace: workspaceData }),
  resetEditedWorkspace: () => set({ editedWorkspace: { id: '', title: '', description: '' } }),
}))

export default useStore
