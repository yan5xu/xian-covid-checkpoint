import React, { render, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import AMapLoader from "@amap/amap-jsapi-loader";
import "./index.scss";
import axios, { AxiosInstance } from "axios";
import { Popup } from "zarm";
import { MakerContent } from "./components/MarkerContent";
import { MakerPopup } from "./components/MarkerPopup";

const defaultSize = 1;

const getCheckPoint = async () => {
  const res = await axios.post("https://ywhasura.xzllo.com/v1/graphql", {
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
      if (status === "complete") {
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
  const [points, setPoints] = useState([]);
  // makerdetail 变量 控制详情窗口展示
  const [makerPopupVisible, setMakerPopupVisible] = useState(false);
  // 渲染marker存放
  const markerArr = [];

  const refresh = async (AMap, _map) => {
    //得到屏幕可视范围的坐标，画出矩形
    const tmapBounds = _map.getBounds();
    const southWest = new AMap.LngLat(
      tmapBounds.southWest.lng,
      tmapBounds.southWest.lat
    );
    const northEast = new AMap.LngLat(
      tmapBounds.northEast.lng,
      tmapBounds.northEast.lat
    );

    const bounds = new AMap.Bounds(southWest, northEast);
    const rectangle = new AMap.Rectangle({
      map: _map,
      bounds: bounds,
      strokeColor: "#FFFFFF",
      strokeWeight: 1,
      strokeOpacity: 0,
      fillOpacity: 0,
      zIndex: 0,
      bubble: true,
    });

    // 加载点
    const point = await getCheckPoint();

    for (let i = 0, marker; i < point.length; i++) {
      var myLngLat = new AMap.LngLat(
        point[i].position[0],
        point[i].position[1]
      );
      // 标点坐标在屏幕显示范围内且图层大于13 地图缩放比例过大时，会将所有隐藏
      if (rectangle.contains(myLngLat) && _map.getZoom() > 13) {
        //如果点在矩形内则输出
        marker = new AMap.Marker({
          map: _map,
          position: point[i].position,
          title: point[i].title,
        });
        // 给marker一个组件用于展示content内容
        marker.content = ReactDOM.render(
          <MakerContent
            data={point[i]}
            onOpen={() => {
              setMakerPopupVisible(true);
            }}
          />
        );
        marker.on("click", (e) => {
          const infoWindow = new AMap.InfoWindow({
            isCustom: true, //使用自定义窗体
            closeWhenClickMap: true, // 点击地图关闭信息窗口
            offset: new AMap.Pixel(0, -50),
          });
          infoWindow.setContent(e.target.content); //必须要用setContent方法
          infoWindow.open(_map, e.target.getPosition());
        });
        // 满足条件后将标点放入标点数组
        markerArr.push(marker);
      }
    }
    setPoints(point);
  };

  // 处理缩放结束
  const handleZoomend = (_map) => {
    const sfjb = _map.getZoom();
    if (sfjb < defaultSize) {
      for (let i = 0; i < markerArr.length; i += 1) {
        markerArr[i].hide();
      }
    } else {
      for (let i = 0; i < markerArr.length; i += 1) {
        markerArr[i].show();
      }
    }
  };

  // 处理平移结束
  const handleMoveend = (AMap, _map) => {
    _map.remove(markerArr); //只删除marker点组
    refresh(AMap, _map);
  };

  const loaded = async (AMap) => {
    const _map = new AMap.Map("mapcontainer", {
      viewMode: "3D",
      zoom: defaultSize,
      zooms: [2, 22],
      visible: true, //是否可见
      center: [108.94703, 34.25943], // 初始点
    });

    // 添加监听事件
    AMap.Event.addListener(_map, "zoomend", () => handleZoomend(_map));
    AMap.Event.addListener(_map, "moveend", () => handleMoveend(AMap, _map));

    // !加点
    _map.add(markerArr);
    getLocation(AMap, _map);
    setMap(_map);
  };

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
      .then(loaded)
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="home_div">
      <div className="map-title">
        <h4>
          共收录检测点{points.length}个，检测点实时动态功能正在开发
          <br />
          点击图标可查看检测点详情以及其他信息
          <br />
          其他请联系wx: cplife
        </h4>
      </div>
      <div id="mapcontainer" className="map" style={{ height: "100%" }} />
      <MakerPopup
        visible={makerPopupVisible}
        onClose={() => {
          setMakerPopupVisible(false);
        }}
      ></MakerPopup>
    </div>
  );
};

export default Map;
