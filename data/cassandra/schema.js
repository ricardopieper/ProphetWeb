var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['192.168.10.145'] });

schema = {
    /*
    - Proprietário
	- Local
	- Substrato (desc)
	- Schema:
		- Variáveis e Valores (inferidos automaticamente)
	- Upload de CSV
	- Visualização de dados básica
    */
    commands =[
        "CREATE KEYSPACE prophet WITH REPLICATION - { 'class': 'SimpleStrategy', 'replication_factor': 3 }",
        "use prophet",
        "CREATE TABLE digesters (digester_id uuid PRIMARY KEY, name text, owner text, location text, description text)",
        "CREATE TABLE engine (engine_id uuid PRIMARY KEY, digester_id uuid, name text, location text, description text)"
    ],
    exec = function (f) {

        var queries = commands.map(x => { return { query: x, params: [] }; });

        client.batch(queries, { prepare: true }, function (err) {
            f(err);
        });
        
    }

}

module.exports = schema;
