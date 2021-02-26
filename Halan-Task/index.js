//to use the framework "express"
const express = require('express');
const app = express();


//get the ip address of the host 
var address = require('address');
var ip = address.ipv6();


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



//insert data into table
const query_insert = `
INSERT INTO ip_addresses (ipAddress)
VALUES ('${ip}')
`;

//retrieve data from table
const query_retrieve = `
SELECT *
FROM ip_addresses
`;



//get the ip address
app.get('/ip', (req, res) => {

    //insert ip address into database
    client.query(query_insert, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data insert successful');
        //client.end();
    });

    //print in the page
    res.send(` ${ip} is inserted successfully to database`);
});



app.get('/allips', (req, res) => {

    //res.send('All IPs are retrieved succussfully from Postgres db :)');

    var IPs = [];
    
    client.query(query_retrieve, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        for (let row of data.rows) {
            IPs.push(row);
        }
        
        console.log(IPs);
        res.send(IPs);
        //client.end();
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



//Create table with sql database
const query_createTable = `
CREATE TABLE 
IF NOT EXISTS
ip_addresses  (
    ipAddress varchar(255) 
    );
    `;
    
//run the query
client.query(query_createTable, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Table is successfully created');
    //client.end();
});

    
  



//make the server listen to connections through a specific port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
