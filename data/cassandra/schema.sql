CREATE KEYSPACE IF NOT EXISTS prophet WITH replication = {'class' : 'SimpleStrategy', 'replication_factor' : 3};
use prophet;
CREATE TABLE IF NOT EXISTS digesters (
	digester_id uuid PRIMARY KEY, 
	name text, 
	owner text, 
	location text, 
	description text);

CREATE TABLE IF NOT EXISTS engines (
	engine_id uuid PRIMARY KEY, 
	name text, 
	location text, 
	description text);
	
CREATE TABLE IF NOT EXISTS models (
	model_id uuid PRIMARY KEY,
	digester_id uuid,
	engine_id uuid,
	name text,
	inputvars list<text>,
	outputvar text
);
ALTER TABLE models ADD state int;
ALTER TABLE models ADD trainingResult text;


CREATE TABLE IF NOT EXISTS uploads (
	model_id uuid,
	upload_id uuid,
	file text,
	date timestamp,
	processed boolean,
	result text,
	PRIMARY KEY(model_id, upload_id)
);


CREATE TABLE IF NOT EXISTS basicmodelview (
	model_id uuid PRIMARY KEY,
	avgTemp1 double,
	avgTemp2 double,
	avgTemp3 double,
	avgTempOut double,
	avgpH double,
	avgPressure double,
	avgRetentionTime bigint,
	avgSubstrateConcentration double,
	avgBiogasml double,
	avgCh4ml double,
	avgCo2ml double,
	avgEngineSpeed double,
	avgEnergy double
);

CREATE TABLE IF NOT EXISTS modeldatasets (
	model_id uuid,
	row_id uuid,
	temp1 double,
	temp2 double,
	temp3 double,
	tempOut double,
	pH double,
	pressure double,
	retentionTime bigint,
	substrateConcentration double,
	biogasml double,
	ch4ml double,
	co2ml double,
	engineSpeed double,
	energy double,
	PRIMARY KEY(model_id, row_id)
);

CREATE TABLE IF NOT EXISTS modelparams(
	model_id uuid,
	modelparams_id uuid,
	varname text,
	data blob,
	dimensions list<int>,
	PRIMARY KEY(model_id, modelparams_id),
);

CREATE TABLE IF NOT EXISTS modelpredictions(
	model_id uuid,
	prediction_id uuid,
	inputvalues map<text, double>,
	inputvar text,
	fromValue double,
	toValue double,
	result text, 
	state int	
	PRIMARY KEY(model_id, prediction_id)	
);





