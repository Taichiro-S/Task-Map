import { useCallback, useRef } from 'react'
import { OnConnectEnd, Node, useStoreApi, useReactFlow, OnConnectStart } from 'reactflow'
import useStore, { RFState } from 'stores/flowStore'
import { shallow } from 'zustand/shallow'

const selector = (state: RFState) => ({
  setNodeParent: state.setNodeParent,
  addNewEdge: state.addNewEdge,
  addChildNode: state.addChildNode,
})

export const useNodeConnect = () => {
  const connectingNodeId = useRef<string | null>(null)
  const { project } = useReactFlow()
  const { setNodeParent, addNewEdge, addChildNode } = useStore(selector, shallow)

  const handleNodeConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId
  }, [])

  const store = useStoreApi()
  const getChildNodePosition = (event: MouseEvent | TouchEvent, parentNode?: Node) => {
    const { domNode } = store.getState()

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return
    }

    const { top, left } = domNode.getBoundingClientRect()

    let panePosition = project({
      x: 0,
      y: 0,
    })

    // toucheventにはclientX, clientYがないので、対応が必要
    if (event instanceof MouseEvent) {
      panePosition = project({
        x: event.clientX - left,
        y: event.clientY - top,
      })
    }

    // calculate with positionAbsolute here in order for child nodes to be positioned relative to their parent
    // return {
    //   x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
    //   y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    // }
    return {
      x: panePosition.x,
      y: panePosition.y,
    }
  }
  const handleNodeConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState()
      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane')
      const getChildNodePosition = (event: MouseEvent | TouchEvent, parentNode?: Node) => {
        const { domNode } = store.getState()

        if (
          !domNode ||
          // we need to check if these properites exist, because when a node is not initialized yet,
          // it doesn't have a positionAbsolute nor a width or height
          !parentNode?.positionAbsolute ||
          !parentNode?.width ||
          !parentNode?.height
        ) {
          return
        }

        const { top, left } = domNode.getBoundingClientRect()

        let panePosition = project({
          x: 0,
          y: 0,
        })

        // toucheventにはclientX, clientYがないので、対応が必要
        if (event instanceof MouseEvent) {
          panePosition = project({
            x: event.clientX - left,
            y: event.clientY - top,
          })
        }

        // calculate with positionAbsolute here in order for child nodes to be positioned relative to their parent
        // return {
        //   x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
        //   y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
        // }
        return {
          x: panePosition.x - 20,
          y: panePosition.y - 20,
        }
      }
      if (targetIsPane && connectingNodeId.current) {
        const nodeType = nodeInternals.get(connectingNodeId.current)?.type
        if (nodeType === 'grouping') return
        const parentNode = nodeInternals.get(connectingNodeId.current)
        const childNodePosition = getChildNodePosition(event, parentNode)

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition)
        }
      } else if (!targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current)
        const targetTypeisGroup = (event.target as Element).classList.contains('grouping-node')
        if (parentNode && targetTypeisGroup) {
          const childNodePosition = getChildNodePosition(event, parentNode)
          if (parentNode && childNodePosition) {
            const node: Node = addChildNode(parentNode, childNodePosition)
            const groupinNodes = useStore.getState().nodes.filter((n) => n.type === 'grouping')
            type NodeCandidate = {
              node: Node
              index: number
            }
            let parentGroupingNodeCandidates: NodeCandidate[] = []
            // グループに所属していない場合
            if (node.parentNode === '') {
              // paneの原点からの相対座標
              const nodeX = node.position.x
              const nodeY = node.position.y
              for (const gNode of groupinNodes) {
                const rightEdge = gNode.position.x + gNode.width!
                const leftEdge = gNode.position.x
                const topEdge = gNode.position.y
                const bottomEdge = gNode.position.y + gNode.height!
                if (nodeX > leftEdge && nodeX < rightEdge && nodeY > topEdge && nodeY < bottomEdge) {
                  let index = useStore.getState().nodes.indexOf(gNode)
                  parentGroupingNodeCandidates.push({
                    node: gNode,
                    index: index,
                  })
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
            }
          }
        }

        const targetNodeId = (event.target as Element).getAttribute('data-nodeid')
        const nodes = useStore.getState().nodes
        if (parentNode && targetNodeId && nodes) {
          const childNode = nodes.find((node) => node.id === targetNodeId)
          if (childNode) {
            addNewEdge(parentNode, childNode)
          }
        }
      }
    },
    [getChildNodePosition],
  )

  return {
    handleNodeConnectStart,
    handleNodeConnectEnd,
  }
}
