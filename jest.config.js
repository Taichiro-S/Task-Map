// const fs = require('fs')
// const tsconfig = require('./tsconfig.json')

// // tsconfigから baseUrl を取得する
// const baseUrl = tsconfig.compilerOptions.baseUrl

// // フォルダー名一覧を取得する
// const folders = fs.readdirSync(baseUrl, { withFileTypes: true }).flatMap((ele) => {
//   return ele.isDirectory() ? [ele.name] : []
// })

// /**
//  * @type {import("@jest/types").Config.InitialOptions}
//  */
// const config = {
//   // tsconfig.json の baseUrl によるエイリアスを有効にする
//   moduleNameMapper: folders.reduce((mapper, folderName) => {
//     return {
//       ...mapper,
//       [`^${folderName}(.*)$`]: `<rootDir>/src/${folderName}$1`,
//     }
//   }, {}),

//   testEnvironment: 'jsdom',
//   //   testEnvironment: 'node',
//   testMatch: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],

//   // @testing-library/react を使うためセットアップスクリプト( 後述 )
//   setupFilesAfterEnv: ['<rootDir>/src/test/utils/setup.ts'],

//   // 除外するフォルダーを指定する
//   testPathIgnorePatterns: [
//     '<rootDir>/src/test/utils/', // セットアップが入っているフォルダーは除外する
//     '<rootDir>/node_modules/',
//     '<rootDir>/.next/',
//   ],

//   // コンパイル対象外のフォルダーを指定
//   transformIgnorePatterns: ['/node_modules/', `node_modules/(?!@reactflow/)`],

//   transform: {
//     '.+\\.(t|j)sx?$': [
//       '@swc/jest',
//       {
//         sourceMaps: true, // エラーを見やすくする( 有効じゃないと内容がズレて表示されます )

//         module: {
//           type: 'commonjs', // 出力するファイルをcommonjsとする
//         },

//         jsc: {
//           parser: {
//             syntax: 'typescript', // ソースコードをtypescriptとしてパースする
//             tsx: true, // jsx記法を許可する
//           },

//           transform: {
//             react: {
//               // 必須。省略すると "ReferenceError: React is not defined" が発生します
//               runtime: 'automatic',
//             },
//           },
//         },
//       },
//     ],
//   },
// }

// module.exports = config

// module.exports = {
//   /** @link https://stackoverflow.com/questions/50863312/jest-gives-cannot-find-module-when-importing-components-with-absolute-paths */
//   moduleDirectories: ['node_modules', '<rootDir>/src/'],
//   roots: ['<rootDir>/src/'],
//   testEnvironment: 'jsdom',
//   testPathIgnorePatterns: ['/node_modules/', '<rootDir>/src/__tests__/utils.tsx'],
//   transform: {
//     '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
//   },
// }

// const nextJest = require('next/jest')

// const createJestConfig = nextJest({
//   dir: './',
// })

// const customJestConfig = {
//   moduleDirectories: ['node_modules', '<rootDir>/src/'],
//   roots: ['<rootDir>/src/'],
//   testEnvironment: 'jest-environment-jsdom',
//   testPathIgnorePatterns: ['/node_modules/', '<rootDir>/src/__tests__/utils.tsx'],
// }

// module.exports = createJestConfig(customJestConfig)

const fs = require('fs')
const tsconfig = require('./tsconfig.json')

// tsconfigから baseUrl を取得する
const baseUrl = tsconfig.compilerOptions.baseUrl

// フォルダー名一覧を取得する
const folders = fs.readdirSync(baseUrl, { withFileTypes: true }).flatMap((ele) => {
  return ele.isDirectory() ? [ele.name] : []
})

/**
 * @type {import("@jest/types").Config.InitialOptions}
 */
const config = {
  // tsconfig.json の baseUrl によるエイリアスを有効にする
  moduleNameMapper: folders.reduce((mapper, folderName) => {
    return { ...mapper, [`^${folderName}(.*)$`]: `<rootDir>/src/${folderName}$1` }
  }, {}),

  testEnvironment: 'jsdom',

  testMatch: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],

  // @testing-library/react を使うためセットアップスクリプト( 後述 )
  setupFilesAfterEnv: ['<rootDir>/src/test/utils/setup.ts', 'dotenv/config'],

  // 除外するフォルダーを指定する
  testPathIgnorePatterns: [
    '<rootDir>/src/test/utils/', // セットアップが入っているフォルダーは除外する
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],

  // コンパイル対象外のフォルダーを指定
  transformIgnorePatterns: ['/node_modules/'],

  transform: {
    '.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        sourceMaps: true, // エラーを見やすくする( 有効じゃないと内容がズレて表示されます )

        module: {
          type: 'commonjs', // 出力するファイルをcommonjsとする
        },

        jsc: {
          parser: {
            syntax: 'typescript', // ソースコードをtypescriptとしてパースする
            tsx: true, // jsx記法を許可する
          },

          transform: {
            react: {
              // 必須。省略すると "ReferenceError: React is not defined" が発生します
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
}

module.exports = config
