#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
 
#define REPORTING_PERIOD_MS     1000
int v;

int currentValue;  // global variables are retained on each iteration of loop()
int previousValue;

PulseOximeter pox; 
uint32_t tsLastReport = 0;
void setup()
{
    Serial.begin(9600);
    //Serial.print("Initializing pulse oximeter..");
    // Initialize the PulseOximeter instance
    // Failures are generally due to an improper I2C wiring, missing power supply
    // or wrong target chip
    if (!pox.begin()) {
        //Serial.println("FAILED");
        for(;;);
    } else {
        //Serial.println("SUCCESS");
    }
 
    // The default current for the IR LED is 50mA and it could be changed
    //   by uncommenting the following line. Check MAX30100_Registers.h for all the
    //   available options.
    pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
 
    // Register a callback for the beat detection
    //pox.setOnBeatDetectedCallback(onBeatDetected);
}
void loop()
{
    // Make sure to call update as fast as possible
    pox.update();
    //previousValue=currentValue;
    // Asynchronously dump heart rate and oxidation levels to the serial
    // For both, a value of 0 means "invalid"
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {    
       v=pox.getSpO2();
       currentValue=v;
         if (currentValue != 0 ) {  
              if(previousValue != currentValue){
                Serial.println(currentValue);
              }
          }
       // Serial.println(v);
        //Serial.println("%");
        tsLastReport = millis();
        if (currentValue != 0) {  
               previousValue=currentValue;
          }
        
    }
        //delay(1000)
}
