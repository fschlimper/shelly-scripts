/*
 * Script for a Shelly i4 to control two Dimmer Shellys.
 * The dimmers' brightness is set in individual steps, since
 * there is only one switch per dimmer available.
 */
 
let DEBUG = false;
 
let dimmer = {
  toggleOnOffFct: '/light/0/set?turn=toggle',
  setBrightnessFct: '/light/0/set?turn=on&brightness=',

  tableLight: {
    componentName: "input:3",
    name: "tablelight",
    url: "http://192.168.1.130",
    brgt_steps: ["35", "50", "75", "100"],
    cbrgt: 0
  },

  livingRoom: {
    componentName: "input:2",
    name: "livingroom",
    url: "http://192.168.1.131",
    brgt_steps: ["25", "50", "75", "100"],
    cbrgt: 0
  },

  getDimmerData: function (component) {
    if (component === dimmer.livingRoom.componentName)
      return dimmer.livingRoom;
    if (component === dimmer.tableLight.componentName)
      return dimmer.tableLight;
  },

  callFunction: function (url, fct) {
    Shelly.call("http.get", { url: url + fct });
  },

  callFunction: function (url, fct, callback) {
    Shelly.call("http.get", { url: url + fct }, callback);
  }
};

/*
 * Event handler for single pushs. Turns the light on/off.
 */
Shelly.addEventHandler(function (e) {
  if (e.component === "input:3" || e.component === "input:2") {
    if (e.info.event === "single_push") {
      dimmer.callFunction(dimmer.getDimmerData(e.component).url, dimmer.toggleOnOffFct);
    }
  }
});

/*
 * Eventhandler for the dimming function with a double push.
 */
Shelly.addEventHandler(function (e) {
  if (e.component === "input:3" || e.component === "input:2") {
    if (e.info.event === "double_push") {
      
      let d = dimmer.getDimmerData(e.component);
      
      d.cbrgt = (d.cbrgt + 1) % d.brgt_steps.length;
      
      if (DEBUG) {
        print("Setting brightness for " + d.name + " to " + d.brgt_steps[d.cbrgt] + "%.");
      }
      dimmer.callFunction(d.url, dimmer.setBrightnessFct + d.brgt_steps[d.cbrgt]);
    }
  }
});
