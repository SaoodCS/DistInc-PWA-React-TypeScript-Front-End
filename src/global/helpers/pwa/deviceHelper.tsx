export default class Device {
   static isIphone = /iphone|ipod|ipad/i.test(window.navigator.userAgent);
   static isAndroid = /android/i.test(window.navigator.userAgent);
   static isMobile = /Mobi/i.test(window.navigator.userAgent);
   static isDesktop = !Device.isMobile;
   static isPwa = window.matchMedia('(display-mode: standalone)').matches;
   static isTouchScreen = 'ontouchstart' in window;
   static hasInstalledApp = !window.matchMedia('(display-mode: browser)').matches;
   static isUsingBrowser = window.matchMedia('(display-mode: browser)').matches;
   static hasPushNotifSupport = 'PushManager' in window;
}
