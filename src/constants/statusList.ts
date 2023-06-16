export type Status = {
  id: number
  statusName: string
  statusColorCode: string
  statusColorName: string
  statusDisplay: string
}

export const statusList: Status[] = [
  {
    id: 1,
    statusName: 'waiting',
    statusColorCode: '#cbd5e1',
    statusColorName: 'stone-300',
    statusDisplay: '未着手',
  },
  {
    id: 2,
    statusName: 'doing',
    statusColorCode: '#fcd34d',
    statusColorName: 'yellow-300',
    statusDisplay: '進行中',
  },
  {
    id: 3,
    statusName: 'done',
    statusColorCode: '#a5b4fc',
    statusColorName: 'indigo-300',

    statusDisplay: '完了',
  },
  {
    id: 4,
    statusName: 'pending',
    statusColorCode: '#67e8f9',
    statusColorName: 'cyan-300',
    statusDisplay: '保留',
  },
  {
    id: 5,
    statusName: 'FYA',
    statusColorCode: '#fb7185',
    statusColorName: 'rose-400',

    statusDisplay: '要対応',
  },
  {
    id: 6,
    statusName: '',
    statusColorCode: '#ffffff',
    statusColorName: 'white',
    statusDisplay: '設定しない',
  },
]
