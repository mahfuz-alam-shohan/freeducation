export type DocumentOptions = {
  title: string;
  styles: string[];
  body: string;
  scripts?: string;
};

export function renderDocument({ title, styles, body, scripts }: DocumentOptions): Response {
  const styleBlocks = styles.length ? `<style>${styles.join("\n")}</style>` : "";
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  ${styleBlocks}
</head>
<body>
  ${body}
  ${scripts ?? ""}
</body>
</html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
