import React, { useEffect, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "./index.scss";
import axios, { AxiosInstance } from "axios";
import { NavLink } from "react-router-dom";

const defaultSize = 0;

const getCheckPoint = async () => {
  const res = await axios.post("https://ywhasura.xzllo.com/v1/graphql", {
    query:
      "query getCheckPoint {\n  check_point {\n    id\n    name\n    position\n    type\n info\n  }\n}\n",
    variables: null,
    operationName: "getCheckPoint",
  });
  return res.data.data.check_point.map((one) => ({
    title: one.name,
    position: one.position.split(",").map((str) => parseFloat(str)),
    type: one.type,
    info: one.info,
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
  const [points, setPoints] = useState([]);
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
        // 渲染marker存放
        const markerArr = [];
        // 加载点
        const point = await getCheckPoint();
        const _map = new AMap.Map("mapcontainer", {
          viewMode: "3D",
          zoom: defaultSize,
          zooms: [2, 22],
          visible: true, //是否可见
          center: [108.94703, 34.25943], // 初始点
        });

        //缩放级别begin=============
        AMap.Event.addListener(_map, "zoomend", function () {
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
        });
        //缩放级别end=============

        const refresh = function () {
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

          const blueIcon = new AMap.Icon({
            size: new AMap.Size(19, 32), // 图标尺寸
            image: "//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png", // Icon的图像
            imageSize: new AMap.Size(19, 32), // 根据所设置的大小拉伸或压缩图片
          });

          const retIcon = new AMap.Icon({
            size: new AMap.Size(19, 32), // 图标尺寸
            image:
              "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png", // Icon的图像
            imageSize: new AMap.Size(19, 32), // 根据所设置的大小拉伸或压缩图片
          });

          for (let i = 0, marker; i < point.length; i++) {
            var myLngLat = new AMap.LngLat(
              point[i].position[0],
              point[i].position[1]
            );
            // 标点坐标在屏幕显示范围内且图层大于13   地图缩放比例过大时，会将所有隐藏
            if (rectangle.contains(myLngLat) && _map.getZoom() > defaultSize) {
              //如果点在矩形内则输出
              marker = new AMap.Marker({
                map: _map,
                position: point[i].position,
                title: point[i].title,
                icon: point[i].type === "24小时" ? retIcon : blueIcon,
              });
              let moreInfo = ``;
              if (point[i].info && point[i].info.checkAt) {
                moreInfo = `<div>来源:${point[i].info.source}</div><div>发布:${point[i].info.publishAt}</div><div>收录:${point[i].info.checkAt}</div>`;
              } else {
                moreInfo = `<div>来源:未确认</div>`;
              }
              if (point[i].info && point[i].info.phoneStatus) {
                moreInfo =
                  moreInfo + `<div>电话核实:${point[i].info.phoneStatus}</div>`;
              }
              marker.content =
                (point[i].type === "24小时"
                  ? `<div>${point[i].title}</div>${point[i].info.phone}`
                  : `<div>${point[i].title}</div>`) + moreInfo;
              marker.on("click", markerClick);
              // 满足条件后将标点放入标点数组
              markerArr.push(marker);
            }
          }
        };
        //地图平移结束begin=============
        AMap.Event.addListener(_map, "moveend", function () {
          _map.remove(markerArr); //只删除marker点组
          refresh();
        });
        //地图平移结束end=============

        // 信息窗体
        var infoWindow = new AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          closeWhenClickMap: true, // 点击地图关闭信息窗口
          offset: new AMap.Pixel(0, -50),
        });
        // marker点击
        function markerClick(e) {
          // console.log(e);
          const content = `<div class="marker-content">${e.target.content}</div>`;
          infoWindow.setContent(content); //必须要用setContent方法
          infoWindow.open(_map, e.target.getPosition());
        }
        setPoints(point);
        // !加点
        _map.add(markerArr);
        getLocation(AMap, _map);
        setMap(_map);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const jumpTo = () => {
    window.location.href =
      "https://cloud.seatable.cn/dtable/forms/30f44612-f350-4ff2-b928-6fce6f9aaac4/";
  };
  const jumpToHelp = () => {
    window.location.href =
      "https://cloud.seatable.cn/dtable/forms/30f44612-f350-4ff2-b928-6fce6f9aaac4/";
  };

  const isInWechatMP = () => {
    return (
      (navigator.userAgent.match(/micromessenger/i) &&
        navigator.userAgent.match(/miniprogram/i)) ||
      window.__wxjs_environment === "miniprogram"
    );
  };

  return (
    <div className="home_div">
      <div className="map-title">
        <h4>
          红色为24h检测点，蓝色为临时检测点
          <br />
          大家优先前往自家小区检测点，其次为24h检测点
          <br />
          其他请联系wx: cplife
        </h4>
      </div>
      <div id="mapcontainer" className="map" style={{ height: "100%" }} />
      {isInWechatMP() ? (
        <>
          <div className="addInfo">
            <NavLink to="/postgraduate-help">
              <button className="button-yellow">考研学子</button>
            </NavLink>
          </div>
        </>
      ) : (
        <div className="addInfo">
          <NavLink to="/postgraduate-help">
            <button className="button-yellow">考研学子</button>
          </NavLink>
          <button className="button-yellow" onClick={jumpTo}>
            提供信息
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
