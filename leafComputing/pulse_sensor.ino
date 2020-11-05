#define USE_ARDUINO_INTERRUPTS true    
#include <PulseSensorPlayground.h>      
int currentValue;  
int previousValue;
const int PulseWire = 0;       
const int LED13 = 13;
int Threshold = 526;           
                               
PulseSensorPlayground pulseSensor;  
void setup() {   
  Serial.begin(9600);          
  pulseSensor.analogInput(PulseWire);   
  pulseSensor.blinkOnPulse(LED13);       
  pulseSensor.setThreshold(Threshold);   
   if (pulseSensor.begin()) {
      //This prints one time at Arduino power-up,  or on Arduino reset.  
  }
}
void loop() {
 int myBPM = pulseSensor.getBeatsPerMinute();  // Calls function on our pulseSensor object that returns BPM as an "int".
 previousValue=currentValue;                   // "myBPM" hold this BPM value now. 
 currentValue=myBPM;
if (pulseSensor.sawStartOfBeat()) {            // Constantly test to see if "a beat happened". 
     if (previousValue != currentValue ) { 
       // Serial.println(currentValue);
      if(currentValue <=110){ 
         Serial.println(currentValue);
         
       } 
  } 
}
  delay(20);                    

}
