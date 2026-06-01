import { defaultFormState, templateByCategory } from "@/lib/constants";
import type { Category, FillMode, PromptFormState } from "@/types/prompt";

const rules: Array<{ category: Category; words: string[] }> = [
  {
    category: "meme",
    words: ["表情包", "梗图", "斗图", "聊天表情", "吐槽图", "吐槽", "阴阳怪气", "无语", "破防", "崩溃", "笑死", "发疯"],
  },
  {
    category: "doodle_snap",
    words: ["马克笔", "数字马克笔", "霓虹", "混乱涂鸦", "密集涂鸦", "涂鸦覆盖", "快照", "手持手机", "学生日记", "杂志标记", "故事批注"],
  },
  {
    category: "note",
    words: ["手账", "注解", "涂鸦", "标注", "箭头", "小字", "日系", "可爱", "白色线条", "描边", "doodle"],
  },
  {
    category: "cleanup",
    words: ["清理", "去掉", "去除", "擦除", "扩图", "补背景", "留白", "白边", "墙面", "杂物"],
  },
  {
    category: "film",
    words: ["胶片", "ccd", "复古", "日杂", "怀旧", "颗粒", "低饱和", "闪光灯", "拍立得", "film"],
  },
  {
    category: "portrait",
    words: ["自拍", "人像", "人物", "合照", "脸", "皮肤", "妆容", "穿搭", "证件照", "写真", "五官"],
  },
  {
    category: "travel",
    words: ["旅行", "街景", "风景", "海边", "天空", "城市", "山", "树", "日落", "咖啡店", "路牌", "公园"],
  },
  {
    category: "pet_object",
    words: ["猫", "狗", "宠物", "小物", "玩偶", "杯子", "花", "书", "桌面", "植物", "静物"],
  },
  {
    category: "lifestyle",
    words: ["房间", "卧室", "客厅", "咖啡馆", "餐厅", "书桌", "室内", "空间", "餐桌"],
  },
];

function hasAny(source: string, words: string[]) {
  return words.some((word) => source.includes(word));
}

function uniqueJoin(values: Array<string | undefined>) {
  return Array.from(
    new Set(values.filter(Boolean).flatMap((value) => value!.split(/[，,]/)).map((value) => value.trim()).filter(Boolean)),
  ).join("，");
}

export function detectCategory(rawIdea: string, fallback: Category = "general"): Category {
  const text = rawIdea.toLowerCase();
  return rules.find((rule) => hasAny(text, rule.words))?.category ?? fallback;
}

function detectPhotoType(rawIdea: string, category: Category) {
  const text = rawIdea.toLowerCase();
  if (hasAny(text, ["合照", "双人", "多人"])) return "双人/多人合照";
  if (hasAny(text, ["自拍", "人像", "人物", "脸", "皮肤", "五官", "穿搭"])) return "人物照片";
  if (hasAny(text, ["猫", "狗", "宠物"])) return "宠物照片";
  if (hasAny(text, ["杯子", "书", "花", "植物", "玩偶", "小物", "静物"])) return "物件静物";
  if (hasAny(text, ["餐桌", "咖啡", "甜品", "饮料", "饭", "食物"])) return "餐桌/咖啡/甜品";
  if (hasAny(text, ["表情包", "梗图", "斗图", "聊天表情", "吐槽图"])) return "表情包 / 梗图素材";
  if (hasAny(text, ["快照", "手持手机", "马克笔", "霓虹", "涂鸦覆盖"])) return "真实手持手机随拍快照";
  if (hasAny(text, ["旅行", "街拍", "街道", "城市", "路牌"])) return "旅行街拍";
  if (hasAny(text, ["海边", "山", "天空", "风景", "公园", "草地"])) return "风景照片";
  if (hasAny(text, ["房间", "卧室", "客厅", "书桌", "室内", "咖啡馆", "餐厅"])) return "室内场景";

  return templateByCategory[category].photoType ?? defaultFormState.photoType;
}

function ideaEnhancements(rawIdea: string) {
  const text = rawIdea.toLowerCase();
  return {
    targetStyle: uniqueJoin([
      hasAny(text, ["自然", "真实", "清透"]) ? "自然清透、真实照片感" : undefined,
      hasAny(text, ["日系", "生活感"]) ? "日系生活感" : undefined,
      hasAny(text, ["胶片", "film", "ccd", "复古", "拍立得"]) ? "胶片感、CCD感、复古生活照、轻微颗粒" : undefined,
      hasAny(text, ["手绘", "手账", "注解", "涂鸦", "doodle"]) ? "手绘风注解、日系可爱手账、白色线稿、一笔画风格" : undefined,
      hasAny(text, ["高级", "干净"]) ? "干净高级、简洁留白" : undefined,
      hasAny(text, ["电影", "电影感"]) ? "电影感、柔和对比" : undefined,
      hasAny(text, ["表情包", "梗图", "斗图", "吐槽"]) ? "聊天表情包、社交媒体梗图、干净好笑" : undefined,
    ]),
    mood: uniqueJoin([
      hasAny(text, ["温暖", "暖"]) ? "温暖" : undefined,
      hasAny(text, ["松弛", "放松", "舒服"]) ? "松弛、舒服" : undefined,
      hasAny(text, ["可爱", "小碎念"]) ? "可爱、日记感" : undefined,
      hasAny(text, ["安静", "治愈"]) ? "安静、治愈" : undefined,
      hasAny(text, ["夏日", "海边"]) ? "夏日、清爽" : undefined,
      hasAny(text, ["怀旧", "复古", "ccd", "胶片"]) ? "怀旧、随手记录感" : undefined,
      hasAny(text, ["无语", "震惊", "敷衍", "崩溃", "阴阳怪气", "破防", "笑死", "发疯"]) ? "情绪明确、反应感强、适合聊天表达" : undefined,
    ]),
    lighting: uniqueJoin([
      hasAny(text, ["窗光", "窗边"]) ? "柔和窗边散射光" : undefined,
      hasAny(text, ["自然光"]) ? "柔和自然光" : undefined,
      hasAny(text, ["傍晚", "夕阳", "黄昏"]) ? "傍晚暖光，阴影自然" : undefined,
      hasAny(text, ["夜景", "晚上"]) ? "夜景环境光，亮部不过曝" : undefined,
      hasAny(text, ["闪光灯", "ccd"]) ? "允许轻微闪光灯质感，但不要死白" : undefined,
      hasAny(text, ["提亮", "暗部"]) ? "适度提亮暗部，保留真实阴影" : undefined,
    ]),
    color: uniqueJoin([
      hasAny(text, ["低饱和"]) ? "低饱和、颜色克制" : undefined,
      hasAny(text, ["奶油", "暖白"]) ? "奶油色、暖白、柔和肤色" : undefined,
      hasAny(text, ["蓝", "清爽", "海边"]) ? "清透蓝绿、干净明亮" : undefined,
      hasAny(text, ["胶片", "ccd", "复古"]) ? "低饱和，轻微偏暖或偏青，黑位不死黑" : undefined,
      hasAny(text, ["粉", "可爱", "少女"]) ? "浅粉、浅蓝、柔和浅色点缀" : undefined,
    ]),
    composition: uniqueJoin([
      hasAny(text, ["留白", "文字", "排版"]) ? "增加适当留白，主体不要进入底部安全留白区" : undefined,
      hasAny(text, ["不裁", "不要裁", "保留构图"]) ? "保留原构图，不裁切头发、手和主体关键部位" : undefined,
      hasAny(text, ["竖图", "9:16"]) ? "适配 9:16 竖图，主体居中偏上，底部保留安全区" : undefined,
      hasAny(text, ["方图", "1:1"]) ? "适配 1:1 方图，主体清晰，边缘留白" : undefined,
      hasAny(text, ["突出主体", "主体更突出"]) ? "主体更突出，背景简洁不抢戏" : undefined,
      hasAny(text, ["手绘", "注解", "箭头"]) ? "注解围绕物件分布，保留空白，不遮挡主体和人物脸部" : undefined,
      hasAny(text, ["表情包", "梗图", "斗图", "文字区"]) ? "1:1 方图，主体居中或略偏上，底部或空白处保留大字文字区" : undefined,
    ]),
  };
}

function applyFillMode(
  currentForm: PromptFormState,
  patch: Partial<PromptFormState>,
  mode: FillMode,
  category: Category,
): Partial<PromptFormState> {
  if (mode === "overwrite") return patch;

  const filtered = Object.fromEntries(
    Object.entries(patch).filter(([key]) => {
      const field = key as keyof PromptFormState;
      return !currentForm[field] || currentForm[field] === defaultFormState[field];
    }),
  ) as Partial<PromptFormState>;

  filtered.rawIdea = patch.rawIdea;
  if (
    patch.edit &&
    (!currentForm.edit ||
      currentForm.edit === defaultFormState.edit ||
      currentForm.edit === templateByCategory[category].edit)
  ) {
    filtered.edit = patch.edit;
  }

  return filtered;
}

export function analyzeOffline(
  rawIdea: string,
  currentForm: PromptFormState,
  mode: FillMode,
  fallbackCategory: Category = "general",
): Partial<PromptFormState> & { category: Category } {
  const category = detectCategory(rawIdea, fallbackCategory);
  const template = templateByCategory[category];
  const enhancements = ideaEnhancements(rawIdea);
  const patch: Partial<PromptFormState> = {
    ...template,
    rawIdea,
    photoType: detectPhotoType(rawIdea, category),
    edit: uniqueJoin([rawIdea, template.edit]),
    targetStyle: uniqueJoin([template.targetStyle, enhancements.targetStyle]),
    mood: uniqueJoin([template.mood, enhancements.mood]),
    lighting: uniqueJoin([template.lighting, enhancements.lighting]),
    color: uniqueJoin([template.color, enhancements.color]),
    composition: uniqueJoin([template.composition, enhancements.composition]),
  };

  return {
    ...applyFillMode(currentForm, patch, mode, category),
    category,
  };
}
