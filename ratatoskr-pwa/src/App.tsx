import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Tasks } from "./routes/Tasks";
import { Suggested } from "./routes/Suggested";
import { Repos } from "./routes/Repos";
import { Config } from "./routes/Config";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Tasks />} />
          <Route path="/suggested" element={<Suggested />} />
          <Route path="/repos" element={<Repos />} />
          <Route path="/config" element={<Config />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
