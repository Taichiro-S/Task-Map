import { useState, MouseEvent, TouchEvent, useCallback, DragEvent } from 'react'
import { Node } from 'reactflow'
import useStore, { RFState } from 'stores/flowStore'
import { shallow } from 'zustand/shallow'

const selector = (state: RFState) => ({
  setNodeSelection: state.setNodeSelection,
  reArrangeNodes: state.reArrangeNodes,
  setNodeParent: state.setNodeParent,
})

export const useNodeDrag = () => {
  const [isNodeDragged, setIsNodeDragged] = useState<boolean>(false)
  const { setNodeSelection, reArrangeNodes, setNodeParent } = useStore(selector, shallow)

  const handleNodeClick = (event: MouseEvent | TouchEvent, node: Node) => {
    // console.log('node clicked')
    if (isNodeDragged) {
      setIsNodeDragged(false)
      setNodeSelection(node.id, false)
    } else {
      setNodeSelection(node.id, true)
    }
  }

  const handleNodeDragStart = (event: MouseEvent | TouchEvent, node: Node) => {
    // console.log('node dragg started')
    setIsNodeDragged(true)
    setNodeSelection(node.id, false)
  }

  const handleNodeDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleNodeDragStop = (event: MouseEvent | TouchEvent, node: Node) => {
    // console.log('node dragg stopped')
    setIsNodeDragged(false)
    setNodeSelection(node.id, false)
    if (node.type === 'grouping') {
      //   console.log('grouping node dragged')
      reArrangeNodes(node)
      return
    }
    const groupingNodes = useStore.getState().nodes.filter((n) => n.type === 'grouping')
    // console.log('all groupingNodes', groupingNodes)
    type NodeCandidate = {
      node: Node
      index: number
    }
    let parentGroupingNodeCandidates: NodeCandidate[] = []
    if (node.parentNode === '') {
      //   console.log('no parent')
      const nodePositionXFromPane = node.position.x
      const nodePositionYFromPane = node.position.y
      for (const groupingNode of groupingNodes) {
        if (
          groupingNode.width === undefined ||
          groupingNode.width === null ||
          groupingNode.height === undefined ||
          groupingNode.height === null
        )
          continue
        const rightEdgeOfGroupingNode = groupingNode.position.x + groupingNode.width
        const leftEdgeOfGroupingNode = groupingNode.position.x
        const topEdgeOfGroupingNode = groupingNode.position.y
        const bottomEdgeOfGroupingNode = groupingNode.position.y + groupingNode.height
        if (
          nodePositionXFromPane > leftEdgeOfGroupingNode &&
          nodePositionXFromPane < rightEdgeOfGroupingNode &&
          nodePositionYFromPane > topEdgeOfGroupingNode &&
          nodePositionYFromPane < bottomEdgeOfGroupingNode
        ) {
          let index = useStore.getState().nodes.indexOf(groupingNode)
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
          // console.log('add parent node')
          setNodeParent(node.id, parentNode.node.id)
          return
        }
      }
    } else {
      for (const groupingNode of groupingNodes) {
        if (node.parentNode === groupingNode.id) {
          const nodePositionXFromParentNode = node.position.x
          const nodePositionYFromParentNode = node.position.y
          if (
            groupingNode.width === undefined ||
            groupingNode.width === null ||
            groupingNode.height === undefined ||
            groupingNode.height === null
          )
            continue
          if (
            0 < nodePositionXFromParentNode &&
            nodePositionXFromParentNode < groupingNode.width &&
            0 < nodePositionYFromParentNode &&
            nodePositionYFromParentNode < groupingNode.height
          ) {
            let index = useStore.getState().nodes.indexOf(groupingNode)
            parentGroupingNodeCandidates.push({
              node: groupingNode,
              index: index,
            })
          }
        } else {
          const oldParentNode = useStore.getState().nodes.find((n) => n.id === node.parentNode)
          if (!oldParentNode) return
          if (
            groupingNode.width === undefined ||
            groupingNode.width === null ||
            groupingNode.height === undefined ||
            groupingNode.height === null
          )
            continue
          const nodePositionXFromOldParentNode = node.position.x + oldParentNode.position.x
          const nodePositionYFromOldParentNode = node.position.y + oldParentNode.position.y
          const rightEdgeOfGroupingNode = groupingNode.position.x + groupingNode.width
          const leftEdgeOfGroupingNode = groupingNode.position.x
          const topEdgeOfGroupingNode = groupingNode.position.y
          const bottomEdgeOfGroupingNode = groupingNode.position.y + groupingNode.height
          if (
            nodePositionXFromOldParentNode > leftEdgeOfGroupingNode &&
            nodePositionXFromOldParentNode < rightEdgeOfGroupingNode &&
            nodePositionYFromOldParentNode > topEdgeOfGroupingNode &&
            nodePositionYFromOldParentNode < bottomEdgeOfGroupingNode
          ) {
            let index = useStore.getState().nodes.indexOf(groupingNode)
            parentGroupingNodeCandidates.push({
              node: groupingNode,
              index: index,
            })
          }
        }
      }

      if (parentGroupingNodeCandidates.length !== 0) {
        const parentNode = parentGroupingNodeCandidates.reduce((max, current) =>
          max.index > current.index ? max : current,
        )
        if (parentNode) {
          setNodeParent(node.id, parentNode.node.id)
          return
        }
      }
      setNodeParent(node.id, '')
    }
  }
  return {
    handleNodeClick,
    handleNodeDragStart,
    handleNodeDragOver,
    handleNodeDragStop,
  }
}
