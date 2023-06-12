import { Layout } from 'components'
import Image from 'next/image'
export default function App() {
  return (
    <Layout title="Home">
      <div>
        <h1>MindFlow タスク管理を革新する、ビジュアル化された世界へようこそ</h1>
        <div className="flex justify-around">
          <div className="w-1/2">
            <Image src="/static/Mindmap-rafiki.png" alt="mindmap" width="500" height="500" />
            <a
              href="https://storyset.com/work"
              className="text-xs text-gray-500 hover:text-blue-400 underline"
            >
              Work illustrations by Storyset
            </a>
          </div>
          <div className="w-1/2">
            <h1 className="text-3xl text-center font-zenMaruGothic mb-4 text-neutral-800">
              【MindFlow】は、あなたのタスク管理を一新する全く新しいツールです
            </h1>
            <p className="text-center text-neutral-600">
              。もはや、長々としたリストや、行き来するスプレッドシートに迷い込むことはありません。思考の流れをそのまま描けるインターフェイスで、一目瞭然、全てが手の中に。
              自由に配置・編集できるタスクノード
              テキスト入力可能なタスクノードを自由に配置し、あなたの思考を可視化します。背景色、期限、ステータス、URL、メモといった情報を各ノードに設定可能。色彩を駆使して、視覚的にも情報を整理しましょう。
              タスク間の繋がりを視覚化
              各ノードをエッジで結び、タスク間の関係性を明確に示します。エッジにもテキスト設定が可能なので、ノード間の関連性をより具体的に表現できます。
              まとめて管理するグループノード
              タスクが多くなってきたら、グループノードを利用して一括管理。サイズと背景色の変更が可能なので、視覚的に整理しやすくなっています。
              あなたのタスク管理を、まるでマインドマップのようなフローチャートで行うことで、全てが見えやすくなり、思考がスムーズに進みます。大切なプロジェクトを達成するためのステップが、一目で理解できます。
              革新的なタスク管理ツール【MindFlow】で、あなたの生産性を一段と引き上げ、目標達成への道のりを明瞭にしましょう。思考を描く楽しさを、ぜひ体験してみてください。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
