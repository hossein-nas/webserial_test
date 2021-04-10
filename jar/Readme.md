# READ ME for BiSaR API
## How to run bisarcore-xxx.jar

* Run with java 11 or higher: java - jar bisarcore-0.0.1-SNAPSHOT.jar
* TOMCAT will start on https:localhost:443

## Access API

### GET test
* GET request on localhost:443/api/v1/test
* Response in JSON:
````JSON
{
    "text": "DATE : this is a test response from HOSTNAME",
    "status": true
}
````
### POST payloads
* POST request on localhost:443/api/v1/payloads
* Content-Type: application/json
* Body:
````JSON
{
	"rawPayload":"44E61E41876900020E7250246518E61E3C07E2002065116E69BCF32371A839C05B4ACADE80D517201968D7F92621FB2505E521A24925"
}
````
* Response in JSON (parsed data):
````JSON
{
  "c_field": "SND_NR",
  "manufacturer_code": "E61E",
  "identification": "41876900",
  "version": "02",
  "device_type": "0E",
  "rawPayload": "44E61E41876900020E7250246518E61E3C07E2002065116E69BCF32371A839C05B4ACADE80D517201968D7F92621FB2505E521A24925",
  "decryptedPayload": "AA"
}
````
### GET payloads
* GET request on localhost:443/api/v1/payloads
* Response in JSON, only counter value on **decryptedPayload**:
````JSON
[
  {
    "c_field": null,
    "manufacturer_code": null,
    "identification": null,
    "version": null,
    "device_type": null,
    "rawPayload": "",
    "decryptedPayload": "3"
  }
]
````
