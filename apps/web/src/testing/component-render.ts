import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";

export interface DashboardRenderResult {
  readonly markup: string;
  readonly text: string;
}

export function renderDashboardElement(element: ReactElement): DashboardRenderResult {
  const markup = renderToStaticMarkup(element);

  return {
    markup,
    text: markup.replace(/<[^>]+>/gu, " ").replace(/\s+/gu, " ").trim()
  };
}
