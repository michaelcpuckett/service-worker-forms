import React from "react";
import { Settings } from "./types";

export function PageShell(props: React.PropsWithChildren<{ pageTitle: string; settings: Settings }>) {
  return (
    <html lang="en" className={`theme--${props.settings.theme || 'dark'}`}>
      <head>
        <title>{props.pageTitle}</title>
        <script src="/scroll-restoration.js"></script>
        <link rel="stylesheet" href="/style.css" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {props.children}
      </body>
    </html>
  );
}