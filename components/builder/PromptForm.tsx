import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fieldLabels } from "@/lib/constants";
import type { PromptFormState } from "@/types/prompt";

type Field = keyof PromptFormState;

function FieldControl({
  form,
  field,
  onChange,
  multiline,
}: {
  form: PromptFormState;
  field: Field;
  onChange: (field: Field, value: string) => void;
  multiline?: boolean;
}) {
  const value = form[field];
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{fieldLabels[field]}</span>
      {multiline ? (
        <Textarea value={value} onChange={(event) => onChange(field, event.target.value)} />
      ) : (
        <Input value={value} onChange={(event) => onChange(field, event.target.value)} />
      )}
    </label>
  );
}

export function PromptForm({
  form,
  showNoteFields,
  onChange,
}: {
  form: PromptFormState;
  showNoteFields: boolean;
  onChange: (field: keyof PromptFormState, value: string) => void;
}) {
  return (
    <div className="space-y-7">
      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="md:col-span-2 text-lg font-bold text-slate-950">基础信息</h3>
        <FieldControl form={form} field="photoType" onChange={onChange} />
        <FieldControl form={form} field="usageScene" onChange={onChange} />
        <FieldControl form={form} field="keep" onChange={onChange} multiline />
        <FieldControl form={form} field="edit" onChange={onChange} multiline />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="md:col-span-2 text-lg font-bold text-slate-950">画面方向</h3>
        <FieldControl form={form} field="subject" onChange={onChange} />
        <FieldControl form={form} field="scene" onChange={onChange} />
        <FieldControl form={form} field="actionRelation" onChange={onChange} />
        <FieldControl form={form} field="mood" onChange={onChange} />
        <FieldControl form={form} field="composition" onChange={onChange} multiline />
        <FieldControl form={form} field="aspectRatio" onChange={onChange} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h3 className="md:col-span-2 text-lg font-bold text-slate-950">视觉风格</h3>
        <FieldControl form={form} field="targetStyle" onChange={onChange} />
        <FieldControl form={form} field="lighting" onChange={onChange} />
        <FieldControl form={form} field="color" onChange={onChange} />
        <FieldControl form={form} field="texture" onChange={onChange} />
        <FieldControl form={form} field="quality" onChange={onChange} />
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">{fieldLabels.retouchStrength}</span>
          <SelectNative value={form.retouchStrength} onChange={(event) => onChange("retouchStrength", event.target.value)}>
            <option>轻微修图</option>
            <option>自然轻修</option>
            <option>中等修图</option>
            <option>风格化修图</option>
            <option>明显风格化</option>
          </SelectNative>
        </label>
      </section>

      {showNoteFields ? (
        <section className="grid gap-4 rounded-[24px] bg-rose-50/70 p-4 md:grid-cols-2">
          <h3 className="md:col-span-2 text-lg font-bold text-slate-950">手账注解专用</h3>
          <FieldControl form={form} field="annotationObjects" onChange={onChange} />
          <FieldControl form={form} field="annotationTextStyle" onChange={onChange} />
          <FieldControl form={form} field="lineStyle" onChange={onChange} />
          <FieldControl form={form} field="decorations" onChange={onChange} />
          <div className="md:col-span-2">
            <FieldControl form={form} field="blankSpaceRule" onChange={onChange} multiline />
          </div>
        </section>
      ) : null}

      <section className="grid gap-4">
        <h3 className="text-lg font-bold text-slate-950">禁止项与固定规则</h3>
        <FieldControl form={form} field="negativePrompt" onChange={onChange} multiline />
        <FieldControl form={form} field="bottomSafeArea" onChange={onChange} multiline />
      </section>
    </div>
  );
}
