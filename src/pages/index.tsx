import { Card } from '@mui/material'
import { Layout } from 'components'
import Image from 'next/image'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { DocumentIcon, FolderIcon, ShareIcon } from '@heroicons/react/24/outline'

const CustomCard = styled(Card)`
  background-color: #fafafa;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 0.5rem;
`

export default function App() {
  const router = useRouter()
  return (
    <Layout title="Home">
      <div>
        <div className="flex justify-center">
          <div className="flex items-center justify-around m-10 ">
            <div className="w-full mx-auto">
              <div className="flex justify-center">
                <div className="text-5xl text-start font-zenMaruGothic mb-60 text-neutral-800">
                  <span className="text-blue-400 bg-neutral-100 rounded-full px-10 py-2 font-semibold">
                    TaskFlow
                  </span>
                </div>
              </div>
              <div className="text-2xl text-center font-zenMaruGothic mt-10 text-neutral-800 px-8 py-4 rounded-md bg-neutral-100 bg-opacity-60 ">
                <p className="mb-4 font-semibold">思考の流れをそのまま描けるインターフェイスで</p>
                <p className="font-semibold">あなたのタスク管理を一新します</p>
              </div>
              <div className="flex justify-center mt-10">
                <button
                  className="bg-blue-400 hover:bg-blue-600 text-neutral-100 text-lg font-md px-4 py-2 ml-4 rounded-md"
                  onClick={() => {
                    router.push('/login')
                  }}
                >
                  Login
                </button>
                <button
                  className="bg-orange-400 hover:bg-orange-600 text-neutral-100 text-lg font-md ml-10 px-4 py-2 rounded-md"
                  onClick={() => {
                    router.push('/demo')
                  }}
                >
                  Try Demo
                </button>
              </div>
            </div>
            <div className="m-10 absolute -z-10 opacity-80">
              <Image src="/static/Mindmap-rafiki.png" alt="mindmap" width="600" height="600" />
            </div>
          </div>
        </div>
        <div className="w-1/2 mx-auto">
          <p className="text-4xl text-center font-semibold mb-10 mt-10">TaskFlowの特長</p>
          <CustomCard className="mb-5">
            <div className="flex items-center mb-2">
              <div className="bg-green-400 rounded-full p-1 mr-2">
                <DocumentIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-semibold">自由に配置できるタスクノード</span>
            </div>
            <p>
              タスクノードをキャンバス上に自由に配置し、あなたのタスクを可視化します。背景色、期限、ステータス、URL、メモといった情報を各ノードに設定可能です。
            </p>
          </CustomCard>
          <CustomCard className="mb-5">
            <div className="flex items-center mb-2">
              <div className="bg-yellow-400 rounded-full p-1 mr-2">
                <ShareIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-semibold">タスク間の繋がりを視覚化</span>
            </div>

            <p>
              各ノードをエッジで結び、タスク間の関係性を明確に示します。さらにエッジにテキストを設定し、ノード間の関連性をより具体的に表現しましょう。
            </p>
          </CustomCard>
          <CustomCard className="mb-5">
            <div className="flex items-center mb-2">
              <div className="bg-rose-400 rounded-full p-1 mr-2">
                <FolderIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-semibold">まとめて管理するグループノード</span>
            </div>

            <p>
              タスクが多くなってきたら、グループノードを利用して一括管理。複数のタスクノードをグループ化して整理しましょう。
            </p>
          </CustomCard>
        </div>
        <div className="flex justify-center mb-10">
          <a
            href="https://storyset.com/work"
            className="text-xs text-center mt-0 text-gray-500 hover:text-blue-400 underline"
          >
            Work illustrations by Storyset
          </a>
        </div>
      </div>
    </Layout>
  )
}
