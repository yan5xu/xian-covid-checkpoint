import { FC, useState } from "react";
import { Loading, Popup, Button, ActionSheet, ActivityIndicator } from "zarm";
import {
  MapType,
  getMapApp,
  getAMapNavigationUrl,
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
  // 集中处理导航跳转的函数
  // const handleNavigation = async <T extends () => string>(
  //   cb: T
  // ): Promise<string> => {
  //   // 获取自身定位
  //   const selfLocation = await getGeoLocation();
  //   // 获取跳转url
  //   const url = cb();
  //   return url;
  // };
  const handleNavigation = async (type: MapType) => {
    Loading.show({
      content: <ActivityIndicator size="lg" />,
    });
    // 获取自身定位
    const selfLocation = await getGeoLocation();
    Loading.hide();
    // 获取跳转url
    const url = getAMapNavigationUrl({
      location: {
        lng: data.position[0],
        lat: data.position[1],
      },
      navigationType: "walkmap",
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
          {
            text: "腾讯地图",
            onClick: () => handleNavigation("tencent"),
          },
          {
            text: "高德地图",
            onClick: () => handleNavigation('gaode'),
          },
          {
            text: "百度地图",
            onClick: () => handleNavigation("baidu"),
          },
        ]}
        onMaskClick={() => setNavigationListVisible(false)}
      />
    </>
  );
};
