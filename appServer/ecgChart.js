$(document).ready(() => {
    // if deployed to a site supporting SSL, use wss://
    const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
    const webSocket = new WebSocket(protocol + location.host);
  
    // A class for holding the last N points of telemetry for a device
    class EcgDeviceData {
      constructor(deviceId) {
        this.deviceId = deviceId;
        this.maxLen = 50;
        this.ecgtimeData = new Array(this.maxLen);
        this.ecgData = new Array(this.maxLen);
      }
  
      addECG(time, ecg) {
        this.ecgtimeData.push(time);
        this.ecgData.push(ecg);
  
        if (this.ecgtimeData.length > this.maxLen) {
          this.ecgtimeData.shift();
          this.ecgData.shift();
          
        }
      }
      
    }
  
    // All the devices in the list (those that have been sending telemetry)
    class TrackedDevices {
      constructor() {
        this.devices = [];
      }
  
      // Find a device based on its Id
      findDevice(deviceId) {
        for (let i = 0; i < this.devices.length; i++) {
          if (this.devices[i].deviceId === deviceId) {
            return this.devices[i];
          }
        }
  
        return undefined;
      }
    }
  
    const trackedDevices = new TrackedDevices();
  
    // Define the chart axes
    const ecgchartData = {
      datasets: [
        
        {
          fill: false,
          label: 'ECG',
          yAxisID: 'Ecg',
          borderColor: 'rgba(255, 0, 0, 0.897)',
          pointBoarderColor: 'rgba(255, 0, 0, 1)',
          backgroundColor: 'rgba(255, 0, 0, 0.4)',
          pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
          pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
          spanGaps: true,
        }
      ]
    };
  
    const ecgchartOptions = {
      title: {
        display: true,
        text: 'ECG',
        fontSize: 20,
      },
      scales: {
        yAxes: [{
          id: 'Ecg',
          type: 'linear',
          scaleLabel: {
            labelString: 'signal',
            display: true,
          },
          position: 'left',
        }]
        
      }
    };
  
    // Get the context of the canvas element we want to select
    const ctx = document.getElementById('ecgChart').getContext('2d');
    const myLineChart = new Chart(
      ctx,
      {
        type: 'line',
        data: ecgchartData,
        options: ecgchartOptions,
      });
    
    webSocket.onmessage = function onMessage(message) {
      try {
        const messageData = JSON.parse(message.data);
        console.log(messageData);
        if(messageData.DeviceId == "ecg"){
            const existingDeviceData = trackedDevices.findDevice(messageData.DeviceId);
            if (existingDeviceData) {
          existingDeviceData.addECG(messageData.MessageDate, messageData.IotData.ecg);
          }
        else {
          const newEcg = new EcgDeviceData(messageData.DeviceId);
          trackedDevices.devices.push(newEcg);
          newEcg.addECG(messageData.MessageDate, messageData.IotData.ecg);
          ecgchartData.labels = newEcg.ecgtimeData;
          ecgchartData.datasets[0].data = newEcg.ecgData;
  
        }
        myLineChart.update();
      }
        
      
      } catch (err) {
        console.error(err);
      }
    };
    
  });
  
  