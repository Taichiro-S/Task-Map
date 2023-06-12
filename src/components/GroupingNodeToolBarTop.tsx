import React, { FC, memo } from 'react'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import { useFlowStore } from 'stores/flowStore'
import { nodeColorList } from 'hoge/nodeColorList'

const GroupingNodeToolBarTop: FC<NodeProps> = (props) => {
  const { data, id, selected } = props
  const updateColor = useFlowStore((state) => state.updateNodeColor)
  const { isNodeDragged } = useFlowStore()
  const nodeColor = data.color || '#ffffff'
  return (
    <NodeToolbar
      isVisible={isNodeDragged ? false : selected}
      position={Position.Top}
      className="flex flex-row justify-center items-center p-2 nodrag absolute top-100 left-0"
      // offset={0}
    >
      <div className=" bg-white rounded-2xl drop-shadow-md flex flex-row justify-center items-center p-2">
        <div className="prod-info grid gap-10 drop-shadow-md ">
          <div>
            <ul className="flex flex-row justify-center  items-center">
              {nodeColorList.map((color) =>
                nodeColor === color.colorCode ? (
                  <li key={color.id} className="mr-2 last:mr-0">
                    <span className="block p-1 border-2 border-stone-600  rounded-full transition ease-in duration-300">
                      <button
                        className={`block w-4 h-4 rounded-full`}
                        style={{ backgroundColor: color.colorCode }}
                      ></button>
                    </span>
                  </li>
                ) : (
                  <li key={color.id} className="mr-2 last:mr-0">
                    <span className="block p-1 border-2 border-stone-300 hover:border-stone-600 rounded-full transition ease-in duration-300">
                      <button
                        className={`block w-4 h-4  rounded-full`}
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

export default memo(GroupingNodeToolBarTop)
