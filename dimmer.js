let tableLightSwitch = "input:3";
let livingRoomSwitch = "input:2";

let tableLightUrl = "http://xxx.xxx.xxx.xxx";
let livingRoomUrl = "http://xxx.xxx.xxx.xxx";

let dimmer = {
	dimUpFct: '/light/0?dim=up',
	dimDownFct: '/light/0?dim=down',
	dimStopFct: '/light/0?dim=stop',
	dimInfoFct: '/light/0',
	callFunction: function (url, fct) {
		Shelly.call("http.get", { url: url + fct });
	},
	callFunction: function (url, fct, callback) {
		Shelly.call("http.get", { url: url + fct }, callback);
	}
};

let dim_dir = "UP";
let is_dimming = false;
let DEBUG = true;
let MIN_DIM = 19;
let MAX_DIM = 90;

function getUrl(s) {
	if (s === livingRoomSwitch)
		return livingRoomUrl;
	if (s === tableLightSwitch)
		return tableLightUrl;
}

Shelly.addEventHandler(function (e) {
	if (e.component === "input:3" || e.component === "input:2") {
		if (e.info.event === "long_push") {
			if (DEBUG) {
				print("Long Push dim_dir: ", dim_dir);
			}
			is_dimming = true;
			if (dim_dir === "UP") {
				dimmer.callFunction(getUrl(e.component), dimmer.dimUpFct)
				//Shelly.call("http.get", { url: DIM_UP_URL });
			} else {
				dimmer.callFunction(getUrl(e.component), dimmer.dimDownFct)
				//Shelly.call("http.get", { url: DIM_DOWN_URL });
			}
		}
	}
});

Shelly.addEventHandler(function (e) {
	if (e.component === "input:3" || e.component === "input:2") {
		if (e.info.event === "btn_up") {
			print("Button released");
			if (is_dimming) {
				dimmer.callFunction(getUrl(e.component), dimmer.dimStopFct);
				//Shelly.call("http.get", { url: DIM_STOP_URL });

				//Shelly.call("http.get", { url: DIM_INFO_URL },
				dimmer.callFunction(getUrl(e.component), dimmer.dimInfoFct,
					function (response, error_code, error_message, user_data) {

						let result = JSON.parse(response.body);
						/*if (DEBUG) {
							print("Result: ", JSON.stringify(result));
						}*/

						if (result.brightness <= MIN_DIM) {
							dim_dir = "UP";
						} else if (result.brightness >= MAX_DIM) {
							dim_dir = "DOWN";
						}

						if (DEBUG) {
							print("Brightness: ", result.brightness, " dim_dir: ", dim_dir);
						}
					});
				is_dimming = false;
			}
		}
	}
});
