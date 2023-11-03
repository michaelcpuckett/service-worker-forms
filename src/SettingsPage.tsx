import { Settings } from './types';
import { PageShell } from './PageShell';

export function SettingsPage(props: React.PropsWithChildren<{ settings: Settings }>) {
  return (
    <PageShell pageTitle="Settings" settings={props.settings}>
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
    </PageShell>
  );
}