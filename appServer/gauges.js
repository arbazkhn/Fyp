$(document).ready(() => {
    const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
    const webSocket = new WebSocket(protocol + location.host);
    var g1 = new JustGage({
      id: "pulse",
      value: String(0),
      symbol:' BPM',
      min: 0,
      max: 100,
      label: "Heart Beat",
      relativeGaugeSize: true
  });
    var g2 = new JustGage({
    id: "spo2",
    value: 0,
    symbol:' %',
    min: 0,
    max: 100,
    label: "SPO2",
    relativeGaugeSize: true
    
  });
  
  var g3 = new JustGage({
    id: "temp",
    value: 0,
    symbol:" °F",
    min: 0,
    max: 105,
    label: "Body Temperature",
    relativeGaugeSize: true
    
  });
  
  
    webSocket.onmessage = function onMessage(message) {
      try {
        const messageData = JSON.parse(message.data);
        console.log(messageData);
        if (messageData.DeviceId== "pulse")
        {
         g1.refresh(messageData.IotData.pulse);
        
         } else if(messageData.DeviceId=="spo2"){
          g2.refresh(messageData.IotData.spo2);
         }
         else if(messageData.DeviceId=="temp"){
           g3.refresh(messageData.IotData.temperature);
         }
        }catch (err) {
        console.error(err);
      }
    };
  });
  
  