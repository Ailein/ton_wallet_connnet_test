// index.tsx

import ReactDOM from "react-dom";
import App from "./App";
import { ProvideBackendAuth } from "./ProvideBackendAuth";

ReactDOM.render(
  <ProvideBackendAuth>
    <App />
  </ProvideBackendAuth>,
  document.getElementById("root")
);
