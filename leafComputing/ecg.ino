int currentValue;  
int previousValue;
int ecg;
void setup() {
// initialize the serial communication:
Serial.begin(9600);
pinMode(8, INPUT); // Setup for leads off detection LO +
pinMode(10, INPUT); // Setup for leads off detection LO -

}
void loop() {
if((digitalRead(8) == 1)||(digitalRead(10) == 1)){
Serial.println('!');
}
else{
// send the value of analog input 0:
   ecg=analogRead(A0);
   previousValue=currentValue;
   currentValue=ecg;
   if (previousValue != currentValue) {  
    Serial.println(currentValue);
 }

}
//Wait for a bit to keep serial data from saturating
delay(500);
}
