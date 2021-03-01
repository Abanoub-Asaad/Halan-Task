const express = require('express');
const app = express();

const ADDRESS = require('address');
const IP = ADDRESS.ipv6();

//connecting to the database "postgres"
const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: '123456789@',
    port: 5432,
});
client.connect();


//Create table query
const query_createTable = `
CREATE TABLE 
IF NOT EXISTS
ip_addresses  (
    ipAddress varchar(255) 
);
`;
    
//insert query
const query_insert = `
INSERT INTO ip_addresses (ipAddress)
VALUES ('${IP}'
`;

//retrieve query
const query_retrieve = `
SELECT *
FROM ip_addresses
`;


//run the query of creating database
client.query(query_createTable, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Table is successfully created');
});

//save the ip address to database
app.get('/ip', (req, res) => {
    client.query(query_insert, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data insert successful');
    });

    res.send(` ${IP} is inserted successfully to database`);
});

//retrieve all the ips from database
app.get('/allips', (req, res) => {

    var ips_array = [];
    
    client.query(query_retrieve, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        for (let row of data.rows) {
            ips_array.push(row);
        }
        
        console.log(ips_array);
        res.send(ips_array);
    });
});

//read the main url of the api  
app.get('/', (req, res) => {

    if(!req.query.n) 
        return res.send('Halan ROCKS It') ;
    
    let n = parseInt(req.query.n); 
    n *= n;
    res.send(`${n}`);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
