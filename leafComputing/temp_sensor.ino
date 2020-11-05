#include <OneWire.h>
#include <DallasTemperature.h>
int currentValue;  
int previousValue;
int temp_sensor = 7;

OneWire oneWire(temp_sensor);

DallasTemperature sensors(&oneWire);

int Celsius = 0;
int temperature = 0;

void setup() {
  sensors.begin();
  Serial.begin(9600);
}

void loop() {
  sensors.requestTemperatures();
 
 
  Celsius = sensors.getTempCByIndex(0);
  temperature = (int)sensors.toFahrenheit(Celsius);
  previousValue=currentValue;
   currentValue=temperature;
   if (previousValue != currentValue) {  
    Serial.println(currentValue);
 }
 
delay(1000);
 
}

