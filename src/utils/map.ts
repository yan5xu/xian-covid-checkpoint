export type MapType = "tencent" | "gaode" | "baidu";

export type NavigationParams = {
  location: {
    lat: number;
    lng: number;
  };
  position: {
    lat: number;
    lng: number;
  };
  name: string;
  navigationType: string;
};

// 返回高德的导航url
export function getAMapNavigationUrl(
  params: NavigationParams
): string {
  return `https://m.amap.com/navigation/${params.navigationType}/saddr=${params.location.lng},${params.location.lat},我的位置&daddr=${params.position.lng},${params.position.lat},${params.name}`;
}
// 返回腾讯的导航url
export function getTencentNavigationUrl(params: NavigationParams): string{
  return `https://apis.map.qq.com/uri/v1/routeplan?type=${params.navigationType}&from=我的位置&fromcoord=${params.position.lat},${params.position.lng}&to=${params.name}&tocoord=${params.location.lat},${params.location.lng}&policy=1&referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77`
}

// 返回百度的导航url
export function getBaiduNavigationUrl(params: NavigationParams): string{
  return `https://api.map.baidu.com/direction?origin=latlng:${params.location.lat},${params.location.lng}|name:我的位置&destination=latlng:${params.position.lat},${params.position.lng}|name:${params.name}&mode=${params.navigationType}&origin_region=${`西安`}&destination_region=${`西安`}&src=webapp.baidu.openAPIdemo&output=html`
}