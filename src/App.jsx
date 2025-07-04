import ReactDOM from "react-dom/client";
import React from "react";
import ChecklistSaida from "./ChecklistSaida";

function App() {
  return <ChecklistSaida />;
}

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChecklistSaida />
  </React.StrictMode>
);