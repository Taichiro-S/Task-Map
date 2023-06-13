import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import LooksOneIcon from '@mui/icons-material/LooksOne'
import LooksTwoIcon from '@mui/icons-material/LooksTwo'
import Looks3Icon from '@mui/icons-material/Looks3'
import { CheckIcon } from '@heroicons/react/24/outline'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function DemoInstructionTabs() {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Task Node" {...a11yProps(0)} />
          <Tab label="Group Node" {...a11yProps(1)} />
          <Tab label="エッジ" {...a11yProps(2)} />
          <Tab label="How To Use" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className="h-1/6">
          <li className="flex items-center">
            <LooksOneIcon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              <code className="bg-neutral-50 p-0.5 px-1 text-sm  border-1 border-neutral-600 rounded-md mr-0.5">
                Task
              </code>
              をドラッグ&ドロップして、新規タスクノードを作成しましょう。
            </p>
          </li>
          <li className="flex items-center">
            <LooksTwoIcon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              タスクノードには、背景色、タイトル、ステータス、期限、URL、メモを設定できます。
            </p>
          </li>
          <li className="flex items-center">
            <Looks3Icon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              タスクノードからエッジを伸ばしてマップ上にドロップすることで新たなタスクノードを追加できます。
            </p>
          </li>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="h-1/6">
          <li className="flex items-center">
            <LooksOneIcon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              <code className="bg-neutral-50 p-0.5 px-1 text-sm border-1 border-neutral-600 rounded-md mr-0.5">
                Group
              </code>
              をドラッグ&ドロップして、新規グループノードを作成しましょう。
            </p>
          </li>
          <li className="flex items-center">
            <LooksTwoIcon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              グループノードには背景色とタイトルを設定でき、サイズを変更することができます。
            </p>
          </li>
          <li className="flex items-center">
            <Looks3Icon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              タスクノードをグループノード上にドロップすることで、グループ化できます。
            </p>
          </li>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="h-1/6">
          <li className="flex items-center">
            <LooksOneIcon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              タスクノードからタスクノードへエッジを伸ばして結びつけることができます。
            </p>
          </li>
          <li className="flex items-center">
            <LooksTwoIcon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              エッジをクリックして、テキストを追加できます。
            </p>
          </li>
          <li className="flex items-center">
            <Looks3Icon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              エッジをダブルクリックして、アニメーションを追加できます。
            </p>
          </li>
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div className="h-1/6">
          <li className="flex items-center">
            <CheckIcon className="h-5 w-5 mr-2 text-blue-400" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              グループノードを削除してしまうとグループに含まれるタスクノードも削除されてしまいます。
            </p>
          </li>
          <li className="flex items-center">
            <CheckIcon className="h-5 w-5 mr-2  text-blue-400" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              オートセーブ機能はありません。こまめに保存しましょう。
            </p>
          </li>
          <li className="flex items-center">
            <CheckIcon className="h-5 w-5 mr-2  text-blue-400" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              URL欄を活用し、詳細なメモは外部ツールで行いましょう。
              <a
                className="hover:text-blue-400 underline"
                href="https://www.notion.so/"
                target="_blank"
              >
                notion
              </a>
              がおすすめです。
            </p>
          </li>
        </div>
      </TabPanel>
    </Box>
  )
}
