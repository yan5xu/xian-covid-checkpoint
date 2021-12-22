export type MapType = "tencent" | "gaode" | "baidu";

export type NavigationParams<T> = {
  location: {
    lat: number;
    lng: number;
  };
  position: {
    lat: number;
    lng: number;
  };
  name: string;
  navigationType: T;
};
/**
 * 根据地图类型、位置获取不同的地图页面跳转链接
 * @param {*} mapType 地图类型
 * @param {*} location 经纬度 lat:纬度 lng:经度
 * @param {*} address 详细地址
 */
export function getMapApp(
  mapType: MapType,
  location: {
    lat: number;
    lng: number;
  },
  address: string
) {
  const { lat, lng } = location;
  let url = "";
  switch (mapType) {
    case "tencent":
      url =
        "https://apis.map.qq.com/uri/v1/marker?marker=coord:" +
        lat +
        "," +
        lng +
        ";addr:" +
        address +
        ";title:地址&referer=keyfree";
      break;
    case "gaode":
      url =
        "https://uri.amap.com/marker?position=" +
        lng +
        "," +
        lat +
        "&name=" +
        address +
        "&callnative=1";
      break;
    case "baidu":
      url =
        "http://api.map.baidu.com/marker?location=" +
        lat +
        "," +
        lng +
        "&title=地址&content=" +
        address +
        "&output=html&src=webapp.reformer.appname&coord_type=gcj02";
      break;
    default:
      break;
  }
  return url;
}

export function getAMapNavigationUrl(
  params: NavigationParams<"walkmap" | "buslist" | "carmap" | "ridemap">
): string {
  return `https://m.amap.com/navigation/${params.navigationType}/saddr=${params.location.lng},${params.location.lat},我的位置&daddr=${params.position.lng},${params.position.lat},${params.name}`;
}
