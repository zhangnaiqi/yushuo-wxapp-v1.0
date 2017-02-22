import wx from 'labrador-immutable';
import request from 'al-request';
import { setStore } from 'labrador-redux';
import { sleep } from './utils/utils';
import store from './redux';

if (__DEV__) {
  console.log('当前为开发环境');
}

// 向labrador-redux注册store
setStore(store);

export default class {
  async onLaunch() {
    try {
      const sysInfo = await wx.getSystemInfo();
      this.sysInfo = sysInfo;
      const position = await wx.getLocation();
      this.position = position;
      console.log(`sysInfo: ${sysInfo}, position: ${position}`);
    } catch (error) {
      console.error('startup:', error);
    }
  }
}
