import { Settings } from './types';

export function SettingsPage(props: React.PropsWithChildren<{ settings: Settings }>) {
  return (
    <html>
      <head>
        <title>Settings</title>
        <script src="/scroll-restoration.js"></script>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
        </nav>
        <main>
          <h1>Settings</h1>
          <form action="" method="POST">
            <input type="hidden" name="action" value="/api/settings" />
            <input type="hidden" name="method" value="PUT" />
            <label>
              Theme
              <select name="theme">
                <option value="light" selected={props.settings.theme === 'light' ? true : undefined}>Light</option>
                <option value="dark" selected={props.settings.theme === 'dark' ? true : undefined}>Dark</option>
              </select>
            </label>
            <button type="submit">Save</button>
          </form>
        </main>
      </body>
    </html>
  );
}