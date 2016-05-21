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
	name text
);

CREATE TABLE IF NOT EXISTS models (
	model_id uuid PRIMARY KEY,
	digester_id uuid,
	engine_id uuid,
	name text,
	inputVars list<text>,
	outputVar text
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
	modelparams_id uuid PRIMARY KEY,
	model_id uuid,
	varname text,
	data blob,
	dimensions list<int>
);