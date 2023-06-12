import { TemporalState } from 'zundo'
import { useStore } from 'zustand'
import { useFlowStore, FlowState } from 'stores/flowStore'

export const useTemporalStore = <T extends unknown>(
  selector: (state: TemporalState<FlowState>) => T,
  equality?: (a: T, b: T) => boolean,
) => useStore(useFlowStore.temporal, selector, equality)
