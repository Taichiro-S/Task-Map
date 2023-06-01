import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LooksOneIcon from '@mui/icons-material/LooksOne'
import LooksTwoIcon from '@mui/icons-material/LooksTwo'
import Looks3Icon from '@mui/icons-material/Looks3'

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
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
          <Tab label="Edge" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className="h-1/6">
          <li className="flex items-center">
            <LooksOneIcon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              <code className="bg-neutral-50 p-0.5 text-sm  border-1 border-neutral-600 rounded-md mr-0.5">Task</code>
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
              タスクノードからEdgeを伸ばしてマップ上にドロップすることで新たなタスクノードを追加できます。
            </p>
          </li>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="h-1/6">
          <li className="flex items-center">
            <LooksOneIcon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              <code className="bg-neutral-50 p-0.5 text-sm border-1 border-neutral-600 rounded-md mr-0.5">Group</code>
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
              タスクノードからタスクノードへEdgeを伸ばして結びつけることができます。
            </p>
          </li>
          <li className="flex items-center">
            <LooksTwoIcon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">Edgeをクリックして、テキストを追加できます。</p>
          </li>
          <li className="flex items-center">
            <Looks3Icon color="info" className="h-6 w-6 mr-2" />
            <p className=" text-base font-semibold font-zenMaruGothic">
              Edgeをダブルクリックして、アニメーションを追加できます。
            </p>
          </li>
        </div>
      </TabPanel>
    </Box>
  )
}
