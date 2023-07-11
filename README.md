# TaskFlow

タスク管理のための Web アプリケーションです。フロントエンドを [Next.js](https://nextjs.org/), バックエンドを [Supabase](https://supabase.com/) で構築し、デプロイ先として [Vercel](https://vercel.com/) 、また CI/CD ツールとして [Github Actions](https://github.co.jp/features/actions) を使用しています。  
</br>
[こちら](https://taskflow-phi.vercel.app/)で公開しています。  
ユーザ登録も可能ですが、デモ版は登録なしでお試しいただけます。  
予告なしに非公開とする場合もありますのでご了承ください。

#### 📕 目次

1. [アプリの概要](#what)
2. [このアプリを作ったモチベーション](#why)
3. [主な機能](#function)
4. [こだわった点](#love)
5. [使用した技術](#tech)
6. [基本設計](#design)

<a id="what"></a>

## 1. どんなアプリ？

**フローチャート形式でタスクを管理**できるアプリです。キャンバス上に自由にタスクを配置して、**タスクの分岐、タスク間の関係、タスクのグループ**を表現することができます。

<a id="why"></a>

## 2. 何のために？

よくあるリスト形式のタスク管理アプリでは、タスク間の関係を表現することができません。そのため、自分が取り組んでいるタスクの全体での位置付けや、そもそもの目的を見失ってしまうことがあります（自分自身、そのような経験がよくありました）。
このアプリを使用することで、**全体を俯瞰し、各ステップの進捗度、問題点などを整理して把握できる**ようになることを期待しています。

<a id="function"></a>

## 3. 機能について

### メインの機能

- **登録されたユーザは以下の３つの要素を使用して、フローチャート形式でタスクを管理することができる**

  1. **タスクノード**

     タスクを書き込む。キャンバス上に自由に配置でき、タイトル、背景色、ステータス、締切、URL、メモを設定できる。

  2. **エッジ**

     タスクノードからドラッグ&ドロップで他のタスクと結びつける。テキストとアニメーションを設定できる。キャンバス上にドロップすると新たなタスクノードを生成できる。

  3. **グループノード**

     タスクノードをグループ化することができる。テキスト、背景色、サイズを設定できる。

- ユーザは上記要素を含むキャンバス（ワークスペース）を複数作成することができる
- ワークスペースにはタイトルと説明文を設定することができ、更新、削除することができる
- 未登録ユーザはデモ版を試用することができる

### 認証関係

- Supabase の認証システムを利用してユーザ登録、ログイン、ログアウトができる
- 登録されたメールアドレスには確認用のメールが送信され、承認されるまではログインできない
- 登録されたユーザはアバター画像を設定できる
- 登録されたユーザはパスワード、メールアドレス、ユーザ名、アバター画像の更新ができる
- メールアドレスを更新した際には新たなメールアドレスに確認用のメールが送信される
- パスワードを忘れた場合には　登録されたメールアドレスへのメール送信をリクエストしてパスワードをリセットできる
- 登録したアカウントを削除することができる

### 非機能について

- Next.js の SSG / SSR / CSF を利用して適切なページレンダリングを行い、**UX および SEO の向上**を試みています。
- Supabase の RLS ( Row Level Security ) を適切に設定し、悪意のあるユーザによる**情報の漏洩や改ざんを防ぎます**。
- 一目で機能がわかる UI により、**シンプルかつ高機能**を目指しています。
- ユーザの入力に対して、メールやトーストメッセージによるレスポンス返すことで、**ユーザに親切な設計**を心がけています。

<a id="love"></a>

## 4. こだわった点

### 実際に使ってもらえるアプリにすること

就活用ポートフォリオのためのアプリではなく、実際に誰かに使ってもらえるアプリにすることを目指しています。そのために要件定義から始め、**どのような課題があるか、その課題をどのように解決するか（既存のアプリで解決できないか）**、などを調査し考えるところから始めました。まだユーザは自分しかいませんが、今後このアプリ PR していくことでユーザを増やし、より良いものにしていきたいと考えています。

### 技術スタックの選定

Web アプリ業界、特にフロントエンドの技術スタックは非常に進化が速いと言われています。実際、似たような機能のライブラリが複数存在しており、私のような初学者が、その中から自身のプロジェクトに適したライブラリを選択することは簡単ではありません。そこで、このプロジェクトに最適化どうかは一旦置いておき、**より「モダンな技術」を使用するよう心がけました**。具体的には、Github のスター数、npm trends、qiita や zenn などの技術ブログを調査し、学習コストや機能を含めて総合的に判断した上で、各技術スタックを選定しました。

### セキュアなパスワード変更

Supabase の API には、パスワード更新の際に前のパスワードを確認するメソッドが用意されておらず、ログインした状態では誰でもパスワードを変更することができてしまいます。よりセキュアなパスワード更新のため、Supabase Function として**前のパスワードを確認してから新たなパスワードを登録**するような SQL 文を登録し、RPC ( Remote Postgre Call ) としてクライアントサイドから呼び出して実行するような仕様としています。

<a id="tech"></a>

## 5. 使用した技術

### [Next.js](https://nextjs.org/)

Next.js は React をベースとしたフロントエンドフレームワークです。
ページごとに SSG や SSR といった最適なレンダリングの方法を選択できることが最大の特長で、これにより SEO および UX の向上が期待できます。

### [TypeScript](https://www.typescriptlang.org/)

TypeScript は静的型付けを可能にした JavaScript の上位互換です。
静的型付けにより、コードの安全性が向上し、バグが発見しやすくなります。また JavaScript ベースであるため学習コストが低いのも特長です。

### フロントエンドで使用しているライブラリ

- **_[React Flow](https://reactflow.dev/)_** ( 11.7.0 ) : **フローチャート生成**  
  ノードとエッジからなるフローチャートを作図するためのライブラリです。カスタマイズが容易で、シンプルかつ高機能なフローチャートを簡単に生成できます。このアプリの核となる機能を提供しています。
  <br/>
- **_[TanStack Query](https://tanstack.com/query/latest)_** ( 4.29.5 ) : **キャッシュデータの管理**  
  データベース等から取得したデータをキャッシュして管理するためのライブラリです。ページネーション、無限スクロール、プリフェッチ等多くの用途に対応しています。またデータ更新のためのフックも用意されています。
  <br/>

- **_[MUI](https://mui.com/)_** ( 5.13.2 ) : **UI パーツ**  
  UI を構成するためのパーツのライブラリです。Web アプリケーションで使用する大体のコンポーネントを揃えており、また [styled](https://mui.com/system/styled/) を使用することで容易にカスタムが可能です。[Material-tailwind](https://www.material-tailwind.com/) というのもあるそうです（最近知りました...）。
  <br/>

- **_[zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)_** ( 4.1.4 ) : **グローバルな状態管理**  
  コンパクトでシンプルな Store ベースの状態管理ライブラリです。
  <br/>

- **_[Tailwind CSS](https://tailwindcss.com/)_** ( 3.3.2 ) : **CSS スタイリング**  
  ユーティリティクラスを組み合わせてスタイリングを行います。JSX コンポーネントに className という形でスタイルを直接当てることができ、また VSCode の拡張機能を使えばクラス名を自動補完できます。
  <br/>

- **_[ESlint](https://eslint.org/)_** ( 8.40.0 ) : **コード品質チェック**  
  JavaScript の静的解析ツールです。プラグインを導入して TypeScript にも対応させることが可能です。コーディング規約を定めてコマンドを実行することでコードチェックできるため、チームでの開発において力を発揮します。後述の prettier でフォーマットのルールを定めて併用することが可能です。
  <br/>

- **_[prettier](https://prettier.io/)_** ( 2.8.8 ) : **コードフォーマット**  
  定めたルールに基づいて、コードをフォーマットします。VSCode の設定で保存時に自動でフォーマットを実行することで、常にコードを美しく保つことができます。こちらもチームでの開発で力を発揮しそうです。
  <br/>

- **_[React Hook Form](https://www.react-hook-form.com/)_** (7.43.9) : **フォーム処理**  
  フォームに入力された値を一括で管理でき、後述の yup と組み合わせて詳細なバリデーションが可能です。
  <br/>

- **_[yup](https://github.com/jquense/yup/tree/master)_** ( 1.2.0 ) : **フォームバリデーション**  
  React Hook Form と組み合わせて、フォームのバリデーションを行うことができ、より詳細なバリデーションルールの設定が可能です。
  <br/>

- **_[Jest](https://jestjs.io/ja/)_** ( 29.5.0 ) : **ユニットテスト**  
  JavaScript のためのテストフレームワークです。React では react-testing-library を使用してコンポーネントを render し、ユニットテストを行うことができます。本プロジェクトでは、Next.js にデフォルトで組み込まれている nextJest を使用しています。nextJest ではコンパイラとして Rust を使用しており、従来の Babel よりもテストの実行時間が短縮できます。
  <br/>

- **_[MSW](https://mswjs.io/)_** ( 1.2.1 ) : **テスト時の API モック**  
  リクエストハンドラでレスポンスを設定することで、サーバまたはブラウザから送信された API リクエストを intercept して、設定されたレスポンスを返します。ソースコードを変更する必要がなく、`jest.mock`よりも実際に近い形でテストを行うことができます。

### [Supabase](https://supabase.com/)

Supabase はリアルタイムのデータベース、認証、ストレージ、サーバーレス機能などを提供する BaaS です。
データベースシステムとして PostgreSQL を使用しているため、複雑なリレーショナルデータを扱うことができます。ログインや CRUD 操作などの基本的な SQL 操作のための API が用意されており、また複雑なトランザクション処理などについては、SQL 文を Postgre Function として登録し、RPC ( Remote Postgre Call ) としてクライアントサイドから呼び出すことにより実行可能です。

### [Vercel](https://vercel.com/)

Vercel はウェブアプリケーションの構築とデプロイのためのプラットフォームです。
github のアカウントと紐づけることにより、main ブランチへの push をトリガーにして自動的にアプリケーションがビルドされてデプロイされます。また、main ブランチ以外への push によりプレビューデプロイが実行され、アプリケーションのプレビューおよびプレビューページへのコメントが可能になります。

### [Github Actions](https://github.co.jp/features/actions)

GitHub Actions は、ビルド、テスト、デプロイのパイプラインを自動化できる CI/CD のプラットフォームです。github への push や merge をトリガーにして、テストを実行し、Vercel CLI を使用することでビルドおよびデプロイを自動化できます。

<a id="design"></a>

## 6. 基本設計

### 画面・機能設計

画面遷移、各ページでのユーザ操作、処理内容、画面出力をまとめました。  
Figma で作成しています。  
詳しく見たい方は[こちら](https://www.figma.com/file/SJH51KicrfwhFlOgemvZGk/TaskFlow-pages?type=whiteboard&node-id=18-364&t=cApsvPJoAVR0wGJV-4)から  
<img width="6624" alt="TaskFlow-pages" src="https://github.com/Taichiro-S/TaskFlow/assets/119518065/5c8d3812-cfa6-44a6-ac72-d134e3c6f57e">

### ER 図

[SqlDBM](https://sqldbm.com/Home/) というサイトを利用して作成しました。
![TaskFlow - SqlDBM](https://github.com/Taichiro-S/TaskFlow/assets/119518065/6c3f736e-e6c2-408c-85e1-ac6adf3dccde)
