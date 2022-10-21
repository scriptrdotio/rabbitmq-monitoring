# rabbitmq-monitoring
APIs for rabbitmq monitoring 

# Usage
var clientModule = require("modules/rabbitmq-monitoring/main.js");
var rabbitmqMonitoring = new clientModule.RabbitMQMonitoringClient();
return rabbitmqMonitoring.getOverview();

# Configuration
Configuration includes the following parameters
- username: a user in rabbitmq with access to all vhosts for which data is requested
- password: the same password saved in rabbitmq
- endpoint: url to api endpoint on rabbitmq, typically same url as main rabbitmq service, on port 15672

## Using multiple configurations
To call multiple endpoints,  you will need to initialize multiple clients, one for each conf
var dynConf = {USERNAME: "", PASSWORD: "", ENDPOINT: ""}
var staticConf = require("configFile");

var rabbitmqMonitoring = new clientModule.RabbitMQMonitoringClient(config);
