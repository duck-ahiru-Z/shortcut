export type GradeConfig = {
  id: string;
  title: string;
  description: string;
  knowledgeCount: number;
  practicalCount: number;
  passingRate: string;
};

// Base descriptions
const desc5kyu = "基本的なファイルのコピー＆ペースト、保存、元に戻すなどの基礎操作など、すべてのPCユーザーが身につけるべき必須ショートカットキーを出題します。";
const desc4kyu = "ウィンドウ操作や文字の範囲選択、ブラウザの高度なタブ操作など、ワンランク上の実務向けショートカットキーを出題します。";
const desc3kyu = "WordやExcelなどの各アプリ固有の操作など、応用的なショートカットを出題します。";
const desc2kyu = "さらに高度な操作や、PCの設定周りのショートカットなどを出題します。";
const desc1kyu = "あらゆるアプリをマウスなしで操作する、プロフェッショナル向けの最難関試験です。";

export const ALL_GRADES_LIST = [
  { id: "5kyu", name: "5級 (Win知識)" },
  { id: "4kyu", name: "4級 (Win知識)" },
  { id: "3kyu", name: "3級 (Win知識)" },
  { id: "2kyu", name: "2級 (Win知識)" },
  { id: "1kyu", name: "1級 (Win知識)" },
  { id: "practical-5kyu", name: "5級 (Win実務)" },
  { id: "practical-4kyu", name: "4級 (Win実務)" },
  { id: "practical-3kyu", name: "3級 (Win実務)" },
  { id: "practical-2kyu", name: "2級 (Win実務)" },
  { id: "practical-1kyu", name: "1級 (Win実務)" },
  { id: "mac-5kyu", name: "5級 (Mac知識)" },
  { id: "mac-4kyu", name: "4級 (Mac知識)" },
  { id: "mac-3kyu", name: "3級 (Mac知識)" },
  { id: "mac-2kyu", name: "2級 (Mac知識)" },
  { id: "mac-1kyu", name: "1級 (Mac知識)" },
  { id: "practical-mac-5kyu", name: "5級 (Mac実務)" },
  { id: "practical-mac-4kyu", name: "4級 (Mac実務)" },
  { id: "practical-mac-3kyu", name: "3級 (Mac実務)" },
  { id: "practical-mac-2kyu", name: "2級 (Mac実務)" },
  { id: "practical-mac-1kyu", name: "1級 (Mac実務)" }
];

export const GRADE_CONFIGS: GradeConfig[] = [
  {
    id: "5kyu",
    title: "5級",
    description: desc5kyu,
    knowledgeCount: 10,
    practicalCount: 5,
    passingRate: "80%",
  },
  {
    id: "4kyu",
    title: "4級",
    description: desc4kyu,
    knowledgeCount: 10,
    practicalCount: 5,
    passingRate: "80%",
  },
  {
    id: "3kyu",
    title: "3級",
    description: desc3kyu,
    knowledgeCount: 20,
    practicalCount: 10,
    passingRate: "80%",
  },
  {
    id: "2kyu",
    title: "2級",
    description: desc2kyu,
    knowledgeCount: 20,
    practicalCount: 10,
    passingRate: "80%",
  },
  {
    id: "1kyu",
    title: "1級",
    description: desc1kyu,
    knowledgeCount: 20,
    practicalCount: 15,
    passingRate: "80%",
  }
];

export function getGradeTitle(gradeId: string): string {
  const found = ALL_GRADES_LIST.find(g => g.id === gradeId);
  return found ? found.name : "不明な級";
}

export function getBaseGradeConfig(gradeId: string): GradeConfig | undefined {
  const baseGrade = gradeId.replace("practical-", "").replace("mac-", "").replace("practical-mac-", "");
  return GRADE_CONFIGS.find(g => g.id === baseGrade);
}
export const DEFAULT_GRADE_ID = '3kyu';

export const DEFAULT_GRADE_ID = '3kyu';
