export interface NodeItem {
  name: string;
  children: NodeItem[];
  attrs: Record<string, string | number | undefined> & { style: string } & any;
  // c=1 将标签暴露出来（不被 rich-text 包含）
  c?: number | null | undefined;
  //  标记解析位置
  i?: number | null | undefined;
  // 元素设置宽标识 w = "T" 表示未设置宽
  w?: string | null | undefined;
  // 元素设置高标识 w = "T" 表示未设置高
  h?: string | null | undefined;
  type?: string;
  text?: string;
}
