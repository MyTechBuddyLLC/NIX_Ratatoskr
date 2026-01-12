import Router from 'preact-router';
import { Layout } from './components/Layout';
import { Tasks } from './routes/Tasks';
import { Scheduled } from './routes/Scheduled';
import { Config } from './routes/Config';

export function App() {
  return (
    <Layout>
      <Router>
        <Tasks path="/" />
        <Scheduled path="/scheduled" />
        <Config path="/config" />
      </Router>
    </Layout>
  );
}
