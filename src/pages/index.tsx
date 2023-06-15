import { Card } from '@mui/material'
import { Layout } from 'components'
import Image from 'next/image'
import styled from '@emotion/styled'

const CustomCard = styled(Card)`
  width: 350px;
  background-color: #fafafa;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 0.5rem;
`

export default function App() {
  return (
    <Layout title="Home">
      <div>
        <div className="flex justify-center">
          <div className="flex items-center justify-center">
            <div className="w-1/2">
              <div className="text-5xl text-start font-zenMaruGothic mb-20 text-neutral-800">
                <span className="text-blue-400 bg-neutral-100 rounded-full px-6 py-4 font-semibold">
                  TaskFlow
                </span>
              </div>
              <div className="text-2xl text-start font-zenMaruGothic ml-2 text-neutral-800">
                <p className="mb-4 font-semibold">思考の流れをそのまま描けるインターフェイスで</p>

                <p className="font-semibold">あなたのタスク管理を一新します。</p>
              </div>
              <div className="flex justify-start mt-8">
                <button className="bg-blue-400 text-neutral-100 text-lg font-md px-4 py-2 ml-4 rounded-md">
                  Login
                </button>
                <button className="bg-orange-400 text-neutral-100 text-lg font-md ml-10 px-4 py-2 rounded-md">
                  Try Demo
                </button>
              </div>
            </div>
            <div className="w-1/2">
              <Image src="/static/Mindmap-rafiki.png" alt="mindmap" width="600" height="600" />
            </div>
          </div>
        </div>
        <div className="flex w-4/5 justify-center">
          <CustomCard>
            自由に配置・編集できるタスクノード
            テキスト入力可能なタスクノードを自由に配置し、あなたの思考を可視化します。背景色、期限、ステータス、URL、メモといった情報を各ノードに設定可能。色彩を駆使して、視覚的にも情報を整理しましょう。
          </CustomCard>

          <CustomCard className="ml-0">
            タスク間の繋がりを視覚化
            各ノードをエッジで結び、タスク間の関係性を明確に示します。エッジにもテキスト設定が可能なので、ノード間の関連性をより具体的に表現できます。
          </CustomCard>
          <CustomCard className="ml-0">
            まとめて管理するグループノード
            タスクが多くなってきたら、グループノードを利用して一括管理。サイズと背景色の変更が可能なので、視覚的に整理しやすくなっています。
          </CustomCard>
        </div>
        <p className="text-center text-neutral-600">
          あなたのタスク管理を、まるでマインドマップのようなフローチャートで行うことで、全てが見えやすくなり、思考がスムーズに進みます。大切なプロジェクトを達成するためのステップが、一目で理解できます。
          革新的なタスク管理ツールTaskFlowで、あなたの生産性を一段と引き上げ、目標達成への道のりを明瞭にしましょう。思考を描く楽しさを、ぜひ体験してみてください。
        </p>
        <div className="flex justify-center">
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
