import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import React, { FC, memo, useState } from 'react'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import { useFlowStore } from 'stores/flowStore'
import { statusList } from 'constants/statusList'
import {
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid'
import { urlChecker } from 'utils/urlChecker'
import Tooltip from '@mui/material/Tooltip'
import { nodeColorList } from 'constants/nodeColorList'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const TaskNodeInfoDialog = () => {
  const editedNodeId = useFlowStore((state) => state.editedNodeId)
  const setEditedNodeId = useFlowStore((state) => state.setEditedNodeId)
  const handleClose = () => {
    setEditedNodeId('')
  }
  const nodes = useFlowStore((state) => state.nodes)
  const [toolTiptitle, setToolTiptitle] = useState<string>('COPY')
  const isNodeDragged = useFlowStore((state) => state.isNodeDragged)
  const updateNodeMemo = useFlowStore((state) => state.updateNodeMemo)
  const updateNodeStatus = useFlowStore((state) => state.updateNodeStatus)
  const updateNodeUrl = useFlowStore((state) => state.updateNodeUrl)
  const updateNodeStartTime = useFlowStore((state) => state.updateNodeStartTime)
  const updateNodeEndTime = useFlowStore((state) => state.updateNodeEndTime)
  const setNodesUnselected = useFlowStore((state) => state.setNodesUnselected)
  const updateColor = useFlowStore((state) => state.updateNodeColor)
  const updateNodeLabel = useFlowStore((state) => state.updateNodeLabel)
  const node = nodes.find((node) => node.id === editedNodeId)
  if (!node) return null
  const data = node.data
  const now = new Date()
  const deadline_datetime = new Date(data.ended_at)
  const diff = (deadline_datetime.getTime() - now.getTime()) / (60 * 60 * 1000)
  return (
    <div>
      <Dialog
        open={editedNodeId !== ''}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 0,
            m: -5,
            width: '500px',
          },
        }}
      >
        <DialogTitle className="w-full mx-auto text-center">
          <TextField
            id="standard-basic"
            variant="standard"
            defaultValue={node.data.label}
            fullWidth
            multiline
            maxRows={2}
            inputProps={{
              maxLength: 50,
              style: {
                textAlign: 'center',
              },
            }}
            onChange={(e) => updateNodeLabel(editedNodeId, e.target.value)}
            className="font-semibold"
          />
        </DialogTitle>
        <DialogContent className="mb-10">
          <div>
            <div className="mx-2 flex items-center">
              <div className="mt-2 mb-2 ml-2">
                <span className="font-mono font-bold text-sm mr-6">カラー</span>
              </div>
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
                            updateColor(editedNodeId, color.colorCode)
                          }}
                        ></button>
                      </span>
                    </li>
                  ),
                )}
              </ul>
              {/* <input
                type="color"
                defaultValue={data.color}
                onChange={(e) => updateColor(editedNodeId, e.target.value)}
              /> */}
            </div>

            <div className="mx-2 mt-2 flex items-center">
              <div className="mt-2 mb-2 ml-2">
                <span className="font-mono font-bold text-sm mr-2">ステータス</span>
              </div>
              <ul className="flex justify-evenly items-center">
                {statusList.map((status) =>
                  node.data.status === status.statusName ? (
                    <li key={status.id} className="mr-1 last:mr-0">
                      <span className="block border-2 border-stone-800 rounded-lg">
                        <button
                          className="block rounded-md font-mono font-bold text-sm p-1"
                          style={{ backgroundColor: status.statusColorCode }}
                          onClick={(e) => {
                            updateNodeStatus(editedNodeId, '')
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
                            updateNodeStatus(editedNodeId, status.statusName)
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
              <p className="font-mono font-semibold text-sm text-neutral-600 ml-1 flex items-center">
                {diff < 0 ? (
                  <span className="text-red-500">
                    <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                  </span>
                ) : (
                  diff <= 1 && (
                    <span className="text-yellow-300">
                      <ExclamationTriangleIcon className="h-5 w-5 mr-1" />
                    </span>
                  )
                )}
              </p>
              <input
                className="w-5/12 h-full bg-neutral-100 outline-none overflow-hidden rounded-md p-2 font-mono font-medium text-sm"
                type="datetime-local"
                onChange={(e) => {
                  updateNodeStartTime(editedNodeId, e.target.value)
                }}
                defaultValue={data.started_at}
              />
              〜
              <input
                className="w-5/12 h-full bg-neutral-100 outline-none overflow-hidden rounded-md p-2 font-mono font-medium text-sm"
                type="datetime-local"
                onChange={(e) => {
                  updateNodeEndTime(editedNodeId, e.target.value)
                }}
                defaultValue={data.ended_at}
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
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskNodeInfoDialog
