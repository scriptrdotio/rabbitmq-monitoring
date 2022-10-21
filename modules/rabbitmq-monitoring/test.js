var clientModule = require("modules/rabbitmq-monitoring/main.js");
var rabbitmqMonitoring = new clientModule.RabbitMQMonitoringClient();
//return rabbitmqMonitoring.getOverview();
return rabbitmqMonitoring.getStats();
