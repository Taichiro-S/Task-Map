import React, { FC, memo } from 'react'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import useStore from 'stores/flowStore'
import { statusList } from 'constants/statusList'

const CustomNodeToolBarBottom: FC<NodeProps> = (props) => {
  const { data, id, selected } = props
  const nodes = useStore((state) => state.nodes)

  const { isNodeDragged } = useStore()
  const updateNodeMemo = useStore((state) => state.updateNodeMemo)
  const updateNodeStatus = useStore((state) => state.updateNodeStatus)
  const node = nodes.find((node) => node.id === id)
  if (!node) throw new Error('node not found')
  return (
    <NodeToolbar
      isVisible={isNodeDragged ? false : selected}
      position={Position.Bottom}
      className="flex flex-row justify-center items-center p-2"
    >
      <div className=" bg-white rounded-2xl drop-shadow-md items-center p-2">
        <div>
          <div className="prod-info grid gap-10">
            <div>
              <div className="mt-2 mb-2 ml-2">
                <span className="font-mono font-bold text-md ">ステータス</span>
              </div>
              <ul className="flex flex-row justify-center  items-center">
                {statusList.map((status) =>
                  node.data.status === status.statusName ? (
                    <li key={status.id} className="mr-1 last:mr-0">
                      <span className="block border-2 border-stone-800 rounded-lg">
                        <button
                          className="block rounded-md font-mono font-bold text-sm p-1"
                          style={{ backgroundColor: status.statusColorCode }}
                          onClick={(e) => {
                            updateNodeStatus(id, '')
                          }}
                        >
                          {status.statusDisplay}
                        </button>
                      </span>
                    </li>
                  ) : (
                    <li key={status.id} className="mr-1 last:mr-0">
                      <span className="block border-2 opacity-60 border-stone-300 hover:border-stone-600 rounded-lg">
                        <button
                          className="block rounded-md font-mono font-bold text-sm p-1"
                          style={{
                            backgroundColor: status.statusColorCode,
                          }}
                          onClick={(e) => {
                            updateNodeStatus(id, status.statusName)
                          }}
                        >
                          {status.statusDisplay}
                        </button>
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* <hr className="mt-4 bg-gray-600"></hr> */}
        <div className="mt-2 mb-2 ml-2">
          <span className=" font-mono font-bold text-md">メモ</span>
        </div>
        <textarea
          className="w-full h-5/6 bg-gray-100 rounded-md p-2 text-center font-mono font-bold text-sm"
          value={node.data.memo}
          onChange={(e) => {
            updateNodeMemo(node.id, e.target.value)
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          style={{
            // userSelect: 'text',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden',
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            hyphens: 'auto',
            zIndex: 10,
          }}
        />
      </div>
    </NodeToolbar>
  )
}

export default memo(CustomNodeToolBarBottom)
