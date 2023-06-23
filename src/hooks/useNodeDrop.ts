import { useCallback, DragEvent } from 'react'
import { Node, XYPosition } from 'reactflow'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { shallow } from 'zustand/shallow'

const selector = (state: FlowState) => ({
  addNewGroupNode: state.addNewGroupNode,
  addNewNode: state.addNewNode,
  reArrangeNodes: state.reArrangeNodes,
  setNodeParent: state.setNodeParent,
})

export const useNodeDrop = (reactFlowInstance: any, reactFlowBounds: DOMRect | undefined) => {
  const { addNewNode, addNewGroupNode, reArrangeNodes, setNodeParent } = useFlowStore(
    selector,
    shallow,
  )

  const handleNodeDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      //   console.log('node dropped')
      event.preventDefault()
      const nodeType: string = event.dataTransfer.getData('application/reactflow')

      if (typeof nodeType === 'undefined' || !nodeType) {
        return
      }

      if (reactFlowBounds && reactFlowInstance) {
        let Droppedposition: XYPosition = { x: 0, y: 0 }
        if (nodeType === 'grouping') {
          Droppedposition = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top - 30,
          })
        } else if (nodeType === 'task') {
          Droppedposition = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left - 10,
            y: event.clientY - reactFlowBounds.top - 20,
          })
        }
        let droppedNode: Node | null = null
        if (nodeType === 'grouping') {
          droppedNode = addNewGroupNode(Droppedposition)
          reArrangeNodes(droppedNode)
          return
        } else if (nodeType === 'task') {
          droppedNode = addNewNode(Droppedposition)
        }
        if (droppedNode === null || !droppedNode) return
        if (droppedNode.parentNode) return
        const nodePositionX = droppedNode.position.x
        const nodePositionY = droppedNode.position.y
        const groupingNodes = useFlowStore.getState().nodes.filter((n) => n.type === 'grouping')
        type NodeCandidate = {
          node: Node
          index: number
        }
        let parentGroupingNodeCandidates: NodeCandidate[] = []
        for (const groupingNode of groupingNodes) {
          const rightEdgeOfgroupingNode = groupingNode.position.x + groupingNode.width!
          const leftEdgeOfgroupingNode = groupingNode.position.x
          const topEdgeOfgroupingNode = groupingNode.position.y
          const bottomEdgeOfgroupingNode = groupingNode.position.y + groupingNode.height!
          if (
            nodePositionX > leftEdgeOfgroupingNode &&
            nodePositionX < rightEdgeOfgroupingNode &&
            nodePositionY > topEdgeOfgroupingNode &&
            nodePositionY < bottomEdgeOfgroupingNode
          ) {
            let index = useFlowStore.getState().nodes.indexOf(groupingNode)
            parentGroupingNodeCandidates.push({
              node: groupingNode,
              index: index,
            })
          }
        }

        if (parentGroupingNodeCandidates.length !== 0) {
          const parentNode = parentGroupingNodeCandidates.reduce((max, current) =>
            max.index > current.index ? max : current,
          )
          if (parentNode) {
            setNodeParent(droppedNode.id, parentNode.node.id)
            return
          }
        }
        setNodeParent(droppedNode.id, '')
        return
      }
    },
    [
      reactFlowInstance,
      reactFlowBounds,
      addNewGroupNode,
      addNewNode,
      reArrangeNodes,
      setNodeParent,
    ],
  )

  return {
    handleNodeDrop,
  }
}
