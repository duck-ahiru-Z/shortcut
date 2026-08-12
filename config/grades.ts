export type GradeConfig = {
  id: string;
  title: string;
  badgeText: string;
  badgeClass: string;
  description: string;
  knowledgeCount: number;
  practicalCount: number;
  passingRate: string;
};

export const GRADE_CONFIGS: GradeConfig[] = [
  {
    id: "5kyu",
    title: "5級",
    badgeText: "受験可能",
    badgeClass: "badge-available",
    description: "基本的なファイルのコピー＆ペースト、保存、元に戻すなどの基礎操作など、すべてのPCユーザーが身につけるべき必須ショートカットキーを出題します。",
    knowledgeCount: 30,
    practicalCount: 5,
    passingRate: "80%",
  },
  {
    id: "4kyu",
    title: "4級",
    badgeText: "受験可能",
    badgeClass: "badge-available",
    description: "ウィンドウ操作や文字の範囲選択、ブラウザの高度なタブ操作など、ワンランク上の実務向けショートカットキーを出題します。",
    knowledgeCount: 30,
    practicalCount: 5,
    passingRate: "80%",
  },
  {
    id: "3kyu",
    title: "3級",
    badgeText: "受験可能",
    badgeClass: "badge-available",
    description: "WordやExcelなどの各アプリ固有の操作など、応用的なショートカットを出題します。",
    knowledgeCount: 20,
    practicalCount: 20,
    passingRate: "80%",
  },
  {
    id: "2kyu",
    title: "2級",
    badgeText: "受験可能",
    badgeClass: "badge-available",
    description: "さらに高度な操作や、PCの設定周りのショートカットなどを出題します。",
    knowledgeCount: 40,
    practicalCount: 40,
    passingRate: "80%",
  },
  {
    id: "1kyu",
    title: "1級",
    badgeText: "受験可能",
    badgeClass: "badge-available",
    description: "あらゆるアプリをマウスなしで操作する、プロフェッショナル向けの最難関試験です。",
    knowledgeCount: 20,
    practicalCount: 20,
    passingRate: "80%",
  }
];
