import "./App.css";
import { ConfigProvider } from "zarm";
import zhCN from "zarm/lib/config-provider/locale/zh_CN";
import { config as AmapReactConfig } from "@amap/amap-react";
import MapComponent from "./pages/MapContainer";

function App() {
  AmapReactConfig.key = "e10e14f5f4232d3f6bef02d34bb4f716";
  AmapReactConfig.plugins = ["AMap.ToolBar"];
  return (
    <div className="App">
      <ConfigProvider locale={zhCN}>
        <MapComponent></MapComponent>
      </ConfigProvider>
    </div>
  );
}

export default App;
