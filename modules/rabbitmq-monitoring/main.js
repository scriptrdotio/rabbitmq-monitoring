var config = require("modules/rabbitmq-monitoring/config.js");
var http = require("http");
var log = require("log");
log.setLevel("info");

/**
 * Rabbitmq monitoring client
 * @class RabbitMQMonitoringClient
 * @constructor RabbitMQMonitoringClient
 * 
 */
function RabbitMQMonitoringClient(clientConf) {
	this.username = config.USERNAME;
    this.password = config.PASSWORD;
    this.endpoint = config.ENDPOINT
}

/*
 * Internal method, wrapper for http calls, including auth from config
 *
 */
RabbitMQMonitoringClient.prototype._callApi = function(path){
    var token = btoa(this.username + ":" + this.password)
    var requestObj = {
        url: encodeURI(this.endpoint + path),
        headers: {
            Authorization: "Basic " + token 
        }
    }
    log.info(JSON.stringify(requestObj));
    var response = http.request(requestObj);
    return response;
    var returnObject = {
        statusMessage: (response.status==200||response.status==204)?"success":"failure",
        status: response.status, 
        response: response.body
    }
    log.info(JSON.stringify(response))
	return returnObject;
} 

/*
 * Internal method responsible for translating vhost names into client account keys
 * vhosts in rabbitmq are named as base64(accountKey:instanceName)
 */
RabbitMQMonitoringClient.prototype._transformResponse = function(path){
    var stats = this._callApi(path);
    if(stats.status != 200){
        //return some error
    }else{
        stats = JSON.parse(stats.body);
        for(var i = 0 ; i < stats.length; i++){
                try{//try catch in case we fall on an item that isn't base64
	                	//messages stats doesn't exist in general vhost / nor in the unknown section with name == username
                    var account = atob(stats[i].name);
                    if(account.indexOf("@") != -1){
                        stats[i].account = account.replace(/@.*/,"")

                    }//else this is not a typical accountkey@clustername, more like either the / or username                        
                    
    	        }catch(e){
        	        //leave the name as is, this is either a / or the actual username
            	}
            //}		
    	}
        return stats
    }    
}

/**
 * Get stats from rabbitmq cluster defined in config
 * stats will be the result of the /vhosts API, returning all available vhosts and stats about each
 * 
 * @return API /vhosts json response, with additional account field pointing to owner account of the vhost
 */
RabbitMQMonitoringClient.prototype.getStats = function() {
    path = "/vhosts";
	return this._transformResponse(path)
}

/**
 * Get overview API response from rabbitmq cluster defined in config
 * stats will include cluster information and cluster level stats
 * @return API /overview json response, with additional account field pointing to owner account of the vhost
 */
RabbitMQMonitoringClient.prototype.getOverview = function() {
    path = "/overview";
    return this._transformResponse(path)
}
