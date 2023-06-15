import React, { FC, memo, useState } from 'react'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import { useFlowStore } from 'stores/flowStore'
import { statusList } from 'constant_values/statusList'
import {
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid'
import { urlChecker } from 'utils/urlChecker'
import Tooltip from '@mui/material/Tooltip'

const CustomNodeToolBarBottom: FC<NodeProps> = (props) => {
  const { data, id } = props
  const nodes = useFlowStore((state) => state.nodes)
  const [toolTiptitle, setToolTiptitle] = useState<string>('COPY')
  const { isNodeDragged } = useFlowStore()
  const updateNodeMemo = useFlowStore((state) => state.updateNodeMemo)
  const updateNodeStatus = useFlowStore((state) => state.updateNodeStatus)
  const updateNodeUrl = useFlowStore((state) => state.updateNodeUrl)
  const updateNodeStartTime = useFlowStore((state) => state.updateNodeStartTime)
  const updateNodeEndTime = useFlowStore((state) => state.updateNodeEndTime)
  const setNodesUnselected = useFlowStore((state) => state.setNodesUnselected)
  const node = nodes.find((node) => node.id === id)
  if (!node) throw new Error('node not found')
  const now = new Date()
  const deadline_datetime = new Date(data.started_at)
  const diff = (deadline_datetime.getTime() - now.getTime()) / (60 * 60 * 1000)
  return (
    <NodeToolbar
      isVisible={isNodeDragged ? false : data.open ? data.open : false}
      position={Position.Bottom}
      className="flex flex-row justify-center items-center p-2"
      onClick={(e) => {
        e.stopPropagation()
        setNodesUnselected()
        e.preventDefault()
      }}
    >
      <div className="bg-white rounded-2xl items-center p-2 w-full">
        <div>
          {/* <div className="mt-2 mb-2 ml-2">
            <span className="font-mono font-bold text-md ">ステータス</span>
          </div> */}
          <div className="mx-2 mt-2">
            <ul className="flex justify-evenly items-center">
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
        <div className="m-2 flex justify-around items-center">
          <div className="bg-neutral-100 rounded-md flex items-center w-full justify-center">
            <p className="font-mono font-semibold text-sm text-neutral-600 w-1/2 ml-2 flex items-center">
              {diff < 0 ? (
                <span className="text-red-500">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                </span>
              ) : (
                diff <= 1 && (
                  <span className="text-yellow-300">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  </span>
                )
              )}
              しめきり ：
            </p>
            <input
              className="w-full h-full bg-neutral-100 outline-none overflow-hidden rounded-md p-2 font-mono font-medium text-sm"
              type="datetime-local"
              onChange={(e) => {
                updateNodeStartTime(id, e.target.value)
              }}
              defaultValue={data.started_at}
            />
          </div>
        </div>
        <div className="m-2 bg-neutral-100 rounded-md flex items-center">
          <input
            className="w-5/6 h-full bg-neutral-100 outline-none overflow-hidden rounded-md p-2 font-mono font-medium text-sm"
            value={data.url}
            onChange={(e) => {
              updateNodeUrl(node.id, e.target.value)
            }}
            type="url"
            placeholder="https://example.com"
          />
          <div className="flex justify-end">
            <span className="">
              <Tooltip title="GO TO URL" placement="top">
                <ArrowTopRightOnSquareIcon
                  className={`h-5 w-5 text-blue-400 ${
                    data.url && 'hover:text-blue-500'
                  }  cursor-pointer broder-2 bg-neutral-100 rounded-md mr-1`}
                  onClick={() => {
                    if (urlChecker(data.url)) {
                      window.open(data.url)
                    }
                  }}
                />
              </Tooltip>
            </span>
            <span>
              <Tooltip title={toolTiptitle} placement="top">
                <ClipboardDocumentIcon
                  className={`h-5 w-5 text-gray-400 ${
                    data.url && 'hover:text-blue-400'
                  }  cursor-pointer broder-2 bg-neutral-100 rounded-md`}
                  onClick={() => {
                    navigator.clipboard.writeText(data.url)
                    setToolTiptitle('COPIED!!')
                    setTimeout(() => {
                      setToolTiptitle('COPY')
                    }, 2000)
                  }}
                />
              </Tooltip>
            </span>
          </div>
        </div>
        <div className="m-2">
          <textarea
            placeholder="メモ"
            className="w-full h-5/6 bg-neutral-100 outline-none overflow-auto rounded-md p-2 font-mono font-medium text-sm"
            value={data.memo}
            onChange={(e) => {
              updateNodeMemo(node.id, e.target.value)
            }}
          />
        </div>
      </div>
    </NodeToolbar>
  )
}

export default memo(CustomNodeToolBarBottom)
