export type Category =
  | "portrait"
  | "lifestyle"
  | "film"
  | "note"
  | "travel"
  | "pet_object"
  | "cleanup"
  | "general";

export type FillMode = "overwrite" | "fill-empty";

export type BuilderMode = "offline";

export type PromptFormState = {
  rawIdea: string;
  photoType: string;
  usageScene: string;
  keep: string;
  edit: string;
  subject: string;
  scene: string;
  actionRelation: string;
  mood: string;
  composition: string;
  aspectRatio: string;
  targetStyle: string;
  lighting: string;
  color: string;
  texture: string;
  quality: string;
  retouchStrength: string;
  annotationObjects: string;
  annotationTextStyle: string;
  lineStyle: string;
  decorations: string;
  blankSpaceRule: string;
  negativePrompt: string;
  bottomSafeArea: string;
};

export type SavedBuilderState = {
  formState: PromptFormState;
  selectedCategory: Category;
  mode: BuilderMode;
};
