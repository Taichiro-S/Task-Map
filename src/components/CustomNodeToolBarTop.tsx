import React, { FC, memo } from 'react'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { nodeColorList } from 'constants/nodeColorList'

const CustomNodeToolBarTop: FC<NodeProps> = (props) => {
  const { data, id, selected } = props
  const updateColor = useFlowStore((state) => state.updateNodeColor)
  const { isNodeDragged } = useFlowStore()
  return (
    <NodeToolbar
      isVisible={isNodeDragged ? false : selected}
      position={Position.Top}
      className="flex flex-row justify-center items-center p-2 nodrag"
    >
      <div className=" bg-white rounded-2xl drop-shadow-md flex flex-row justify-center items-center p-2">
        <div className="prod-info grid gap-10 drop-shadow-md ">
          <div>
            <ul className="flex flex-row justify-center  items-center">
              {nodeColorList.map((color) =>
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
              )}
            </ul>
          </div>
        </div>
      </div>
    </NodeToolbar>
  )
}

export default memo(CustomNodeToolBarTop)
