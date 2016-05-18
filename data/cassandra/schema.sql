CREATE KEYSPACE prophet WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 3 };
use prophet;
CREATE TABLE digesters (
	digester_id uuid PRIMARY KEY, 
	name text, 
	owner text, 
	location text, 
	description text);

CREATE TABLE engines (
	engine_id uuid PRIMARY KEY, 
	name text, 
	location text, 
	description text);
	
--aqui vão ser cadastrados os modelos, que podem pertencer ou a um digestor ou motor.
CREATE TABLE models (
	model_id uuid PRIMARY KEY,
	digester_id uuid,
	engine_id uuid,
	name text
);

--select var1 from modelparams 
--where model_id = 12390182830921
--and varname = "theta1"

CREATE TABLE modelparams(
	model_id uuid,
	varname text,
	data blob,
	dimensions list<int>
);



