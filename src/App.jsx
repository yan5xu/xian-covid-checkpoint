import "./App.css";
import { ConfigProvider } from "zarm";
import zhCN from "zarm/lib/config-provider/locale/zh_CN";
import MapComponent from "./pages/MapContainer";

function App() {
  return (
    <div className="App">
      <ConfigProvider locale={zhCN}>
        <MapComponent></MapComponent>
      </ConfigProvider>
    </div>
  );
}

export default App;
