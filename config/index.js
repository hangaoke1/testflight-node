const path = require('path')
module.exports = {
	/**
	 * 服务端接口地址
	 * 测试地址: 27.148.190.44
	 * 线上地址: 120.79.73.174
	 */
	serverUrl: {
		// 指纹同步地址
		fingerprint: 'http://120.79.73.174:8080/buyer/suning/fingerprint',
		// 获取全局指纹
		queryFingerprint: 'http://120.79.73.174:8080/buyer/suning/queryFingerprint'
	}
};
