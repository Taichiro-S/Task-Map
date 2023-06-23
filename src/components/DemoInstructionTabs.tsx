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
          <Tab label="How To Use" {...a11yProps(0)} />
          <Tab label="Task Node" {...a11yProps(1)} />
          <Tab label="Group Node" {...a11yProps(2)} />
          <Tab label="Edge" {...a11yProps(3)} />
          <Tab label="Tips" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className="h-1/6">
          <ul className="list-decimal font-zenMaruGothic">
            <li>スクロールでキャンバスを上下移動、Shift + スクロールで左右移動できます。</li>
            <li>Cmd ( Windowsの場合はCtrl ) + スクロールで拡大縮小できます。</li>
            <li>ノードをドラッグ&ドロップして自由に配置できます。</li>
          </ul>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="h-1/6">
          <ul className="list-decimal font-zenMaruGothic">
            <li>
              <code className="bg-neutral-50 p-0.5 px-1 text-sm  border-1 border-neutral-600 rounded-md mr-0.5">
                Task
              </code>
              をドラッグ&ドロップして、新規タスクノードを作成しましょう。
            </li>
            <li>タスクノードには、背景色、タイトル、ステータス、期限、URL、メモを設定できます。</li>
            <li>
              タスクノードからエッジを伸ばしてマップ上にドロップすることで新たなタスクノードを追加できます。
            </li>
          </ul>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="h-1/6">
          <ul className="list-decimal font-zenMaruGothic">
            <li>
              <code className="bg-neutral-50 p-0.5 px-1 text-sm border-1 border-neutral-600 rounded-md mr-0.5">
                Group
              </code>
              をドラッグ&ドロップして、新規グループノードを作成しましょう。
            </li>
            <li>グループノードには背景色とタイトルを設定でき、サイズを変更することができます。</li>
            <li>タスクノードをグループノード上にドロップすることで、グループ化できます。</li>
          </ul>
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div className="h-1/6">
          <ul className="list-decimal font-zenMaruGothic">
            <li>タスクノードからタスクノードへエッジを伸ばして結びつけることができます。</li>
            <li>エッジをクリックして、テキストを追加できます。</li>
            <li>エッジをダブルクリックして、アニメーションを追加できます。</li>
          </ul>
        </div>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <div className="h-1/6">
          <ul className="list-decimal font-zenMaruGothic">
            <li>
              グループノードを削除するとグループに含まれるタスクノードも削除されます。注意しましょう。
            </li>
            <li>オートセーブ機能はありません。こまめに保存しましょう。</li>
            <li>
              URL欄を活用し、詳細なメモは外部ツールで行いましょう。
              <a
                className="hover:text-blue-400 underline"
                href="https://www.notion.so/"
                target="_blank"
              >
                notion
              </a>
              がおすすめです。
            </li>
          </ul>
        </div>
      </TabPanel>
    </Box>
  )
}
