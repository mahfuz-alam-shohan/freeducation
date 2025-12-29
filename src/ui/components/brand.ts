import { logoMark } from "./icons";

type BrandProps = {
  title: string;
  subtitle: string;
  className?: string;
};

export function renderBrand({ title, subtitle, className }: BrandProps) {
  const classes = ["brand", className].filter(Boolean).join(" ");
  return `
    <div class="${classes}">
      <div class="brand-logo">${logoMark}</div>
      <div>
        <div class="brand-title">${title}</div>
        <div class="brand-subtitle">${subtitle}</div>
      </div>
    </div>
  `;
}
