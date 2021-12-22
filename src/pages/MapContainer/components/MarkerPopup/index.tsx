import { FC, useState } from "react";
import { Loading, Popup, Button, ActionSheet, ActivityIndicator } from "zarm";
import {
  MapType,
  getMapApp,
  getAMapNavigationUrl,
  getTencentNavigationUrl,
  NavigationParams,
} from "../../../../utils/map";
import "./index.scss";

interface Props {
  data: {
    name: string;
    position: number[];
  };
  visible: boolean;
  getGeoLocation: () => Promise<{
    position: {
      lng: number;
      lat: number;
    };
  }>;
  onClose?: () => void;
}

export const MakerPopup: FC<Props> = ({
  visible,
  onClose,
  data,
  getGeoLocation,
}) => {
  const [navigationListVisible, setNavigationListVisible] = useState(false);
  // 处理点击导航的事件
  const handleClickNavigation = () => {
    setNavigationListVisible(true);
  };
  const handleNavigation = async (type: MapType, navigationType: string) => {
    // 根据type定义回调函数字典
    const cbDictionary: Record<MapType, (params: NavigationParams) => string> = {
      "gaode": getAMapNavigationUrl,
      // "tencent": getTencentNavigationUrl,
    }
    Loading.show({
      content: <ActivityIndicator size="lg" />,
    });
    // 获取自身定位
    const selfLocation = await getGeoLocation();
    Loading.hide();
    // 获取跳转url
    const url = cbDictionary[type]({
      location: {
        lng: data.position[0],
        lat: data.position[1],
      },
      navigationType,
      name: data.name,
      position: {
        lng: selfLocation.position.lng,
        lat: selfLocation.position.lat,
      },
    });
    // 关闭所有弹窗
    setNavigationListVisible(false)
    onClose && onClose()
    window.open(url)
  };
  return (
    <>
      <Popup
        visible={visible}
        direction="bottom"
        onMaskClick={() => {
          onClose && onClose();
        }}
        mountContainer={() => document.body}
      >
        <div className="detail-popup">
          <Button block theme="primary" onClick={() => handleClickNavigation()}>
            立即导航去这里
          </Button>
        </div>
      </Popup>
      <ActionSheet
        visible={navigationListVisible}
        actions={[
          // {
          //   text: "腾讯地图",
          //   onClick: () => handleNavigation("tencent", "walk"),
          // },
          {
            text: "高德地图",
            onClick: () => handleNavigation('gaode', "walkmap"),
          },
          // {
          //   text: "百度地图",
          //   onClick: () => handleNavigation("baidu"),
          // },
        ]}
        onMaskClick={() => setNavigationListVisible(false)}
      />
    </>
  );
};
