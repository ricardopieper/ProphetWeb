var cassandra = require('cassandra-driver');

module.exports = {
 contactPoints: ['192.168.42.209:9042'], 
 keyspace: 'prophet',
 profiles: [
	new cassandra.ExecutionProfile('default', {
		readTimeout: 100000,
		writeTimeout: 600000
	})
 ]};
