import { useState, MouseEvent, TouchEvent, useCallback, DragEvent } from 'react'
import { Node } from 'reactflow'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { useTemporalStore } from 'stores/temporalStore'
import { shallow } from 'zustand/shallow'

const selector = (state: FlowState) => ({
  setNodeSelection: state.setNodeSelection,
  reArrangeNodes: state.reArrangeNodes,
  setNodeParent: state.setNodeParent,
})

export const useNodeDrag = () => {
  const [isNodeDragged, setIsNodeDragged] = useState<boolean>(false)
  const { setNodeSelection, reArrangeNodes, setNodeParent } = useFlowStore(selector, shallow)
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
    // console.log('node drag started')
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
    // group node はグループ化しない
    if (node.type === 'grouping') {
      //   console.log('grouping node dragged')
      reArrangeNodes(node)
      return
    }
    // 全てのグループノードを取得
    const groupingNodes = useFlowStore.getState().nodes.filter((n) => n.type === 'grouping')
    // console.log('all groupingNodes', groupingNodes)
    type NodeCandidate = {
      node: Node
      index: number
    }
    let parentGroupingNodeCandidates: NodeCandidate[] = []
    // ドロップされる前にグループ化されていなかった場合
    if (node.parentNode === '') {
      //   console.log('no parent')
      const nodePositionXFromPane = node.position.x
      const nodePositionYFromPane = node.position.y
      //
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
          let index = useFlowStore.getState().nodes.indexOf(groupingNode)
          parentGroupingNodeCandidates.push({
            node: groupingNode,
            index: index,
          })
        }
      }
      // groupingNodeCandidatesの中で一番indexが大きい（＝最前面にある）ものを親ノードとする
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
      // ドロップされる前にグループ化されていた場合
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
          // 元のグループノード上にドロップされた場合
          if (
            0 < nodePositionXFromParentNode &&
            nodePositionXFromParentNode < groupingNode.width &&
            0 < nodePositionYFromParentNode &&
            nodePositionYFromParentNode < groupingNode.height
          ) {
            // 元のグループノードを候補に加える
            let index = useFlowStore.getState().nodes.indexOf(groupingNode)
            parentGroupingNodeCandidates.push({
              node: groupingNode,
              index: index,
            })
          }
        } else {
          const oldParentNode = useFlowStore.getState().nodes.find((n) => n.id === node.parentNode)
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
          // 別のグループノード上にドロップされた場合
          if (
            nodePositionXFromOldParentNode > leftEdgeOfGroupingNode &&
            nodePositionXFromOldParentNode < rightEdgeOfGroupingNode &&
            nodePositionYFromOldParentNode > topEdgeOfGroupingNode &&
            nodePositionYFromOldParentNode < bottomEdgeOfGroupingNode
          ) {
            // グループノードを候補に加える
            let index = useFlowStore.getState().nodes.indexOf(groupingNode)
            parentGroupingNodeCandidates.push({
              node: groupingNode,
              index: index,
            })
          }
        }
      }
      // groupingNodeCandidatesの中で一番indexが大きい（＝最前面にある）ものを親ノードとする
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
