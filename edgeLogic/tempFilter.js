// This function filters out messages that report temperatures below the temperature threshold.
// It also adds the MessageType property to the message with the value set to Alert.
var temperatureThreshold = 100;
function filterMessage(client, inputName, msg) {
    client.complete(msg, printResultFor('Receiving message'));
    if (inputName === 'input1') {
        var message = msg.getBytes().toString('utf8');
        var messageBody = JSON.parse(message);
        if (messageBody && messageBody.machine && messageBody.machine.temperature && messageBody.machine.temperature > temperatureThreshold) {
            console.log(`Machine temperature ${messageBody.machine.temperature} exceeds threshold ${temperatureThreshold}`);
            var outputMsg = new Message(message);
            outputMsg.properties.add('MessageType', 'Alert');
            client.sendOutputEvent('output1', outputMsg, printResultFor('Sending received message'));
        }
    }
}
client.on('inputMessage', function (inputName, msg) {
    filterMessage(client, inputName, msg);
    });

    client.getTwin(function (err, twin) {
        if (err) {
            console.error('Error getting twin: ' + err.message);
        } else {
            twin.on('properties.desired', function(delta) {
                if (delta.TemperatureThreshold) {
                    temperatureThreshold = delta.TemperatureThreshold;
                }
            });
        }
    });