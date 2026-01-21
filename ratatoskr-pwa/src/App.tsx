import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Tasks } from "./routes/Tasks";
import { TaskDetail } from "./routes/TaskDetail";
import { Suggested } from "./routes/Suggested";
import { SuggestionDetail } from "./routes/SuggestionDetail";
import { Repos } from "./routes/Repos";
import { RepoDetail } from "./routes/RepoDetail";
import { Config } from "./routes/Config";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Tasks />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/suggested" element={<Suggested />} />
          <Route path="/suggestions/:suggestionId" element={<SuggestionDetail />} />
          <Route path="/repos" element={<Repos />} />
          <Route path="/repos/:repoId" element={<RepoDetail />} />
          <Route path="/config" element={<Config />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
