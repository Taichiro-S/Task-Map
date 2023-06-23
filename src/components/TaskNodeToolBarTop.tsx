import React, { FC, memo } from 'react'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { nodeColorList } from 'constants/nodeColorList'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const TaskNodeToolBarTop: FC<NodeProps> = (props) => {
  const { data, id, selected } = props
  const updateColor = useFlowStore((state) => state.updateNodeColor)
  const { isNodeDragged } = useFlowStore()
  const editedNodeId = useFlowStore((state) => state.editedNodeId)
  const setEditedNodeId = useFlowStore((state) => state.setEditedNodeId)
  const deleteNode = useFlowStore((state) => state.deleteNode)
  const deleteEdge = useFlowStore((state) => state.deleteEdge)
  const edges = useFlowStore((state) => state.edges)
  const edgesToDelete = edges.map((edge) => {
    if (edge.source === id || edge.target === id) return edge
  })
  return (
    <NodeToolbar
      isVisible={isNodeDragged ? false : selected}
      position={Position.Top}
      className="flex flex-row justify-center items-center p-2 nodrag"
    >
      <div className=" bg-white rounded-2xl drop-shadow-md flex flex-row justify-center items-center px-2 py-1">
        <div className="prod-info grid gap-10 drop-shadow-md ">
          <div className="flex flex-row justify-center  items-center">
            {/* <ul className="flex flex-row justify-center  items-center"> */}
            <div
              className="text-blue-400  hover:text-blue-600 cursor-pointer hover:bg-blue-100 p-2 rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                setEditedNodeId(id)
              }}
            >
              <PencilIcon className="h-5 w-5 nodrag" />
            </div>
            <div
              className="text-red-400  hover:text-red-600 cursor-pointer hover:bg-red-100 p-2 rounded-full"
              onClick={(e) => {
                e.stopPropagation()

                for (const edge of edgesToDelete) {
                  if (edge) {
                    deleteEdge(edge.id)
                  }
                }
                deleteNode(id)
              }}
            >
              <TrashIcon className="h-5 w-5 nodrag" />
            </div>

            {/* {nodeColorList.map((color) =>
                data.color === color.colorCode ? (
                  <li key={color.id} className="mr-2 last:mr-0">
                    <span className="block p-1 border-2 border-stone-600  rounded-full transition ease-in duration-300">
                      <button
                        className="block w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.colorCode }}
                      ></button>
                    </span>
                  </li>
                ) : (
                  <li key={color.id} className="mr-2 last:mr-0">
                    <span className="block p-1 border-2 border-stone-300 hover:border-stone-600 rounded-full transition ease-in duration-300">
                      <button
                        className="block w-4 h-4  rounded-full"
                        style={{ backgroundColor: color.colorCode }}
                        onClick={(e) => {
                          updateColor(id, color.colorCode)
                        }}
                      ></button>
                    </span>
                  </li>
                ),
              )} */}
            {/* </ul> */}
          </div>
        </div>
      </div>
    </NodeToolbar>
  )
}

export default memo(TaskNodeToolBarTop)
