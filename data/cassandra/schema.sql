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
	outputvar text,
	millisecondstraining int,
);
ALTER TABLE models ADD state int;
ALTER TABLE models ADD trainingResult text;
ALTER TABLE models ADD millisecondsupload int;
ALTER TABLE models ADD millisecondstransferfile int;
ALTER TABLE models ADD millisecondslastprediction int;

CREATE TABLE IF NOT EXISTS uploads (
	model_id uuid,
	upload_id uuid,
	date timestamp,
	processed boolean,
	result text,
	PRIMARY KEY((model_id), upload_id)
);

CREATE TABLE IF NOT EXISTS uploadchunks (
	model_id uuid,
	upload_id uuid,
	date timestamp,
	chunk text,
	PRIMARY KEY((model_id), upload_id, date)
) WITH clustering order by (upload_id asc, date asc);

CREATE TABLE IF NOT EXISTS basicmodelview (
	model_id uuid PRIMARY KEY,
	averages map<text, double>
);

CREATE TABLE IF NOT EXISTS modeldatasets (
	model_id uuid,
	row_id timestamp,
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
	PRIMARY KEY((model_id), row_id)
) WITH clustering order by (row_id asc);


CREATE TABLE IF NOT EXISTS modelparams(
	model_id uuid,
	modelparams_id uuid,
	varname text,
	data blob,
	dimensions list<int>,
	PRIMARY KEY((model_id), modelparams_id),
);

CREATE TABLE IF NOT EXISTS modelpredictions(
	model_id uuid,
	prediction_id uuid,
	inputvalues map<text, double>,
	inputvar text,
	fromValue double,
	toValue double,
	amountPredictions int,
	result text, 
	state int,	
	PRIMARY KEY((model_id), prediction_id)	
);

create type if not exists predictionid(
	model_id uuid,
	prediction_id uuid
);

CREATE TABLE IF NOT EXISTS dataviews(
	view_id uuid PRIMARY KEY,
	name text,
	predictions set<frozen<predictionid>>
);
