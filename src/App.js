import Main from "./mainPage/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
