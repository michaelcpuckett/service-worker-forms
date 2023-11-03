import { Settings } from "./types";

export function PageShell(props: React.PropsWithChildren<{ pageTitle: string; settings: Settings }>) {
  return (
    <html>
      <head>
        <title>{props.pageTitle}</title>
        <script src="/scroll-restoration.js"></script>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body className={`theme--${props.settings.theme || 'light'}`}>
        {props.children}
      </body>
    </html>
  );
}