import React, { useEffect, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "./MapContainer.css";
import axios, { AxiosInstance } from "axios";

const getCheckPoint = async () => {
  const res = await axios.post("http://81.70.149.112:8098/v1/graphql", {
    query:
      "query getCheckPoint {\n  check_point {\n    id\n    name\n    position\n    type\n  }\n}\n",
    variables: null,
    operationName: "getCheckPoint",
  });
  return res.data.data.check_point.map((one) => ({
    title: one.name,
    position: one.position.split(",").map((str) => parseFloat(str)),
  }));
};

const getLocation = (AMap, _map) => {
  AMap.plugin("AMap.Geolocation", function () {
    var geolocation = new AMap.Geolocation({
      enableHighAccuracy: true, //是否使用高精度定位，默认:true
      timeout: 10000, //超过10秒后停止定位，默认：5s
      buttonPosition: "RB", //定位按钮的停靠位置
      buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
      noGeoLocation: 0,
    });
    _map.addControl(geolocation);
    geolocation.getCurrentPosition(function (status, result) {
      if (status == "complete") {
        onComplete(result);
      } else {
        onError(result);
      }
    });
  });
  //解析定位结果
  function onComplete(data) {
    console.log(data);
  }
  //解析定位错误信息
  function onError(data) {
    console.log(data);
  }
};

const Map = () => {
  const [map, setMap] = useState();
  useEffect(() => {
    AMapLoader.load({
      key: "e10e14f5f4232d3f6bef02d34bb4f716", //需要设置您申请的key
      version: "2.0",
      plugins: ["AMap.ToolBar"],
      AMapUI: {
        version: "1.1",
        plugins: [],
      },
      Loca: {
        version: "2.0.0",
      },
    })
      .then(async (AMap) => {
        const _map = new AMap.Map("mapcontainer", {
          viewMode: "3D",
          zoom: 13,
          zooms: [2, 22],
          visible: true, //是否可见
          center: [108.94703, 34.25943], // 初始点
        });

        // 加载点
        const point = await getCheckPoint();
        console.log(point);

        //! 加点
        for (let item of point) {
          let marker = new AMap.Marker({
            map: _map,
            ...item,
          });
          // create click event
          marker.on("click", (e) => {
              console.log("item:", e)
              let target = e.target;
              marker.setLabel({
                  offset: new AMap.Pixel(-50, -25),
                  content: target._originOpts.title
              });
          });
          _map.add(marker);
        }

        getLocation(AMap, _map);
        setMap(_map);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="home_div">
      <div className="map-title">
        <h3>信息补充，请联系wx: cplife</h3>
      </div>
      <div id="mapcontainer" className="map" style={{ height: "100%" }} />
    </div>
  );
};

export default Map;
