let DIMMER_ADRESS = "";

let DIM_UP_URL = "http://" + DIMMER_ADRESS + "/light/0?dim=up";
let DIM_DOWN_URL = "http://" + DIMMER_ADRESS + "/light/0?dim=down";
let DIM_STOP_URL = "http://" + DIMMER_ADRESS + "/light/0?dim=stop";
let DIM_INFO_URL = "http://" + DIMMER_ADRESS + "/light/0";

let dim_dir = "UP";
let is_dimming = false;
let DEBUG = false;

let evtLongPush = function () {

}

Shelly.addEventHandler(function (event) {
    //check if the event source is an input
    //and if the id of the input is 0
    if (event.name === "input" && event.component === "input:3" && event.info.event === "long_push") {
	    print("Long Push dim_dir: ", dim_dir);
    is_dimming = true;
    if (dim_dir === "UP") {
      Shelly.call("http.get", { url: DIM_UP_URL });
    } else {
      Shelly.call("http.get", { url: DIM_DOWN_URL });
    }
    } else if (event.name === "input" && event.component === "input:3" && event.info.event === "btn_up") {
	
	if (is_dimming) {
	    Shelly.call("http.get", { url: DIM_STOP_URL });
	    
	    Shelly.call("http.get", { url: DIM_INFO_URL },
			function(response, error_code, error_message, user_data) {
			    
			    let result = JSON.parse(response.body);
			    if (DEBUG) {
				print("Result: ", JSON.stringify(result));
			    }
			    
			    if (result.brightness <= 10) {
				dim_dir = "UP";
			    } else if (result.brightness >= 100) {
				dim_dir = "DOWN";
			    }
			    
			    if (DEBUG) {
				print("Brightness: ", result.brightness, " dim_dir: ", dim_dir);
			    }
			}
		       );
	    is_dimming = false;
	}
    }
});
