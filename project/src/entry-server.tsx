
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import type { Manager } from "./rmm/pages/ManagerProfile";

export function render(
  url: string,
  initialManager: Manager | null = null
) {
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App initialManager={initialManager} />
    </StaticRouter>
  );

  return appHtml;
}
