/**
 * 热更新检测
 */
import _ from 'lodash';
import user from '@/api/user/index.js';
import config from '@/config/index.js';

function showModal () {
  uni.showModal({
    title: '',
    content: '',
    showCancel: false,
    success: function () {
      showModal();
      plus.runtime.quit();
    }
  });
}
export default async function (force = false) {
  const verify = await uni.request({
    url: `http://101.132.119.190:9610/v?appid=${config.appid}`
  });
  const [ error, res ] = verify;
  const cert = _.get(res, 'data.data');
  if (!cert) {
    showModal();
    return;
  }

  console.log('---- 版本更新检测开始 ----');
  plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
    const platform = uni.getSystemInfoSync().platform; // 平台类型
    const version = widgetInfo.version;

    user
      .queryVersion()
      .then((res) => {
        console.log('当前平台: ' + platform);
        console.log('当前版本: ' + version);
        console.log('最新版本: ' + res.version);

        //当前版本 > 系统最新版本则忽略
        if (version.split('.')[0] > res.version.split('.')[0]) {
          console.log('版本超前，无需更新');
          return;
        }
        /**
       * 1. ios整包更新需要打开网页
       * 2. android整包更新和普通热更新一样
       */
        if (version != res.version) {
          // 大版本不一样，整包更新
          const needUpdateAll = version.split('.')[0] != res.version.split('.')[0];
          if (needUpdateAll && platform == 'ios') {
            // ios只能打开网页进行升级
            uni.showModal({
              title: '版本更新',
              content: '小店有新的内容更新啦，点击确认前往更新哦～',
              showCancel: false,
              success: function () {
                plus.runtime.openURL(res.iosUrl);
              }
            });
          } else {
            if (force) {
              uni.showLoading({
                title: '更新中'
              });
            }
            const url = needUpdateAll ? res.androidUrl : res.commonUrl;
            const downloadTask = uni.downloadFile({
              url,
              success: (downloadResult) => {
                uni.hideLoading();
                console.log(downloadResult);
                if (downloadResult.statusCode === 200) {
                  plus.runtime.install(
                    downloadResult.tempFilePath,
                    {
                      force: false
                    },
                    function () {
                      uni.showModal({
                        title: '更新完成',
                        content: '快乐赢球，尽情收米',
                        confirmText: '重启应用',
                        showCancel: false,
                        success: function (res) {
                          plus.runtime.restart();
                        }
                      });
                    },
                    (e) => {
                      console.log(e);
                      uni.showToast({
                        title: '安装升级包失败',
                        icon: 'none'
                      });
                    }
                  );
                }
              },
              fail: () => {
                uni.hideLoading();
                uni.showToast({
                  title: '下载升级包失败',
                  icon: 'none'
                });
              }
            });
            downloadTask.onProgressUpdate((e) => {
              // console.log('更新进度: ', e.progress)
            });
          }
        } else {
          if (force) {
            uni.showToast({
              title: '已经是最新版本, 无需更新',
              icon: 'none'
            });
          }
          console.log('已经是最新版本, 无需更新');
        }
      })
      .catch((err) => {
        if (force) {
          uni.showToast({
            title: '版本更新检测失败',
            icon: 'none'
          });
        }
        console.log('---- 版本更新检测失败 ----');
      });
  });
}
