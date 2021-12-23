import React, { useEffect, useState, useRef, useMemo } from "react";
import { Amap, useAmap, loadPlugins } from "@amap/amap-react";
import "./index.scss";
import axios from "axios";
import { MakerPopup } from "./components/MarkerPopup";

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

// 返回定位坐标
export const getGeoLocation = async () => {
  return new Promise(async (resolve, error) => {
    const AMap = await loadPlugins("AMap.Geolocation");
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true, //是否使用高精度定位，默认:true
      timeout: 10000, //超过10秒后停止定位，默认：5s
      buttonPosition: "RB", //定位按钮的停靠位置
      buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
      noGeoLocation: 0,
    });

    geolocation.getCurrentPosition((status, result) => {
      if (status === "complete") {
        resolve(result);
      } else {
        error(result);
      }
    });
  });
};

// 绘制海量点LabelMarker包装组件
const ManyPoints = (props) => {
  const { data, click } = props;
  const map = useAmap();
  const $layer = useRef();

  const handleClickPoint = (e) => {
    const {
      data: {
        data: { position, name },
      },
    } = e;
    click &&
      click({
        position,
        name,
      });
  };

  useEffect(() => {
    if (!map) return;
    if (!$layer.current) {
      $layer.current = new window.AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        collision: false,
      });
      map.add($layer.current);
    }
    const layer = $layer.current;
    const markers = data.map((d) => {
      const _maker = new window.AMap.LabelMarker({
        position: d.position,
        icon: {
          type: "image",
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAfCAYAAAAFkva3AAACd0lEQVR42qWU3UuTYRjG34iiw+gk6CAp2XRqsyazWRuz8c656UF/QV8URhQSNaMP5kzRudQ5Zy3zD+i0gygiZ44oogjDJJBqjMTS1Gxzm1s17+4rYmBzbXt38OPhue/r+jEG7yMQURoWZ2QHY2XGmBkm8ff0Y479er01F3N3eBPTzsQs7gQ1eJPUOETUOMzwiTvm2COH/LqyekdoK+Mz98ep4Q4XhzODPXKcH2W2rZGZupY2MiP17hWycDBXkOfec2ZzSlbXuWg39UXJPER5gx76BJmxY347EzPx/1HHy3xBD314BLF97qLYs0zG26uSQZ89VsHQ9mVUHFgh0ZuUDPrwCIfsM3OGmz/I4P0lGfTZMyvU2qaTtbd+UqHAI+ivBZf1gwnSs10q6LMnLOiuBsZ1rgjpeCCZ/gix542gvfLerXXM00FPXDJaxwKxxyMcuDSlqbEFSeNZkQz68Pz5Ampa3o3t75yl6oFY3qCHfupz0lgnS5i42hUmtTuaM8ijh35KBqovTLSp7Z+oqj+aM8ijl/YEqc+Pb2ECqq6vtM8VyQpyyKOXJgNVza8Pqy5PkbJvOSvIIZ/xpQWqcy9HKvnnV/SGM4I953zI/1e29+wLJZMs7w1RJrBHLqsMVJ55drfCFiBFz/c0MMceuZxkytNPy5hV+Y0l+hfMsc9ZBvY0+e+VtgZJ5vyWAnfMsc9LVn7qiahofkXFzsUUuGOet6zspG8D87G44zPt7l4gnLhjnrcMKE48tsmsb6mIXwWcfG/FXJKs9PijUnmTn3byE4UTd8kyUHLs4Yei69OEE/eCZPKjDwZ3tUwSzoJlsiP3RSbEGLNlfwPf80fNP6DL+QAAAABJRU5ErkJggg==",
          size: [26, 40],
          anchor: "bottom-center",
        },
        text: {
          content: d.title,
          style: {
            fontSize: 14,
            fillColor: "#000000",
            padding: [20, 18],
            backgroundColor: "#FFFFFF",
          },
        },
      });
      _maker.on("click", handleClickPoint);
      return _maker;
    });
    layer.add(markers);

    return () => {
      layer.remove(markers);
    };
  }, [map, data]);

  useEffect(() => {
    return () => {
      if ($layer.current) {
        $layer.current.setMap(null);
      }
    };
  }, []);

  return null;
};

const Main = () => {
  const [points, setPoints] = useState([]);
  // 存储本身
  const [mapSelf, setMapSelf] = useState();
  // 存储当前活动点信息（被点击）
  const [activePoint, setActivePoint] = useState();
  // 存储活动点信息的被缓存坐标
  const makerContentPosition = useMemo(
    () => (activePoint ? activePoint.position : [108.94703, 34.25943]),
    [activePoint]
  );
  // 当前详情popup是否显示
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);
  const map = useRef();

  setTimeout(() => {
    if (map.current && !mapSelf) {
      setMapSelf(map.current);
    }
  }, 1000);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (mapSelf) {
      try {
        const selfLocation = await getGeoLocation(mapSelf);
        mapSelf.setCenter(selfLocation.position);
      } catch {
        mapSelf.setCenter([108.94703, 34.25943]);
      }
      mapSelf.setZoom(17);
      // 加载点
      const point = await getCheckPoint();
      setPoints(point);
    }
  }, [mapSelf]);

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
      <Amap
        ref={map}
        viewMode="3D"
        center={makerContentPosition}
        zooms={[2, 22]}
      >
        {/* 绘制点的组件 */}
        <ManyPoints
          data={points}
          click={(e) => {
            setActivePoint(e);
            setDetailPopupVisible(true);
          }}
        ></ManyPoints>
        {/* 绘制详情的组件 */}
        <MakerPopup
          visible={detailPopupVisible}
          data={activePoint}
          getGeoLocation={getGeoLocation}
          onClose={() => {
            setDetailPopupVisible(false);
          }}
        ></MakerPopup>
      </Amap>
    </div>
  );
};

export default Main;
