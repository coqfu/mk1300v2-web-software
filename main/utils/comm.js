const { DeviceID } = require('../assets/vid_pid_offline.js');

const getPermission = (vid, pid) => {
	let res = false;
	for (let i = 0; i < DeviceID.length; i++) {
		let item = DeviceID[i];
		if ((item.vendorId == vid) && (item.productId == pid)) {
			res = true;
			break;
		}
	}
	return res;
};

module.exports = { getPermission };