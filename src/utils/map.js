/**
 * 根据地图类型、位置获取不同的地图页面跳转链接
 * @param {*} mapType 地图类型
 * @param {*} location 经纬度 lat:纬度 lng:经度
 * @param {*} address 详细地址
 */
export function getMapApp(mapType, location, address) {
  const { lat, lng } = location;
  let url = "";
  switch (mapType) {
    case "腾讯地图":
      url =
        "https://apis.map.qq.com/uri/v1/marker?marker=coord:" +
        lat +
        "," +
        lng +
        ";addr:" +
        address +
        ";title:地址&referer=keyfree";
      break;
    case "高德地图":
      url =
        "https://uri.amap.com/marker?position=" +
        lng +
        "," +
        lat +
        "&name=" +
        address +
        "&callnative=1";
      break;
    case "百度地图":
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
