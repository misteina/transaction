// Test cases

window.onload = async function () {

    document.write('Reset database...<br>');

    await fetch(
        'http://localhost:3000',
        { method: 'POST' }
    ).then(
        response => response.json()
    ).then(
        data => document.write(`<b>Response:</b> ${data.message}<br><br><br>`)
    );
    
    
    

    document.write('Add first user...<br><b>Request:</b> POST /users<br>');

    await fetch(
        'http://localhost:3000/users',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: 'James Kenaan', email: 'james@xyz.com' })
        }
    ).then(
        response => response.json()
    ).then(
        data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br><br>`)
    );




    document.write('Add bitcoin account for first user...<br><b>Request:</b> POST /currencies<br>');

    await fetch(
        'http://localhost:3000/currencies',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bitcoin: '7ufg487l-q9f6-3984-p4e6-94jdf84r784l' })
        }
    ).then(
        response => response.json()
    ).then(
        data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br><br>`)
    );




    document.write('Add second user...<br><b>Request:</b> POST /users<br>');

    await fetch(
        'http://localhost:3000/users',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: 'David Burrow', email: 'david@xyz.com' })
        }
    ).then(
        response => response.json()
    ).then(
        data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br><br>`)
    );


    

    document.write('Add Bitcoin account for second user...<br><b>Request:</b> POST /currencies<br>');

    await fetch(
        'http://localhost:3000/currencies',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bitcoin: '8a15ne4d-3d6c-6745-d282-da885h64pqf9' })
        }
    ).then(
        response => response.json()
    ).then(
        data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br><br>`)
    );



    document.write('Send Bitcoin amount from user ID 2 to user ID 1...<br><b>Request:</b> POST /transactions<br>');

    await fetch(
        'http://localhost:3000/transactions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                amount: '100.00',
                currency: 'Bitcoin',
                target: '1'
            })
        }
    ).then(
        response => response.json()
    ).then(
        data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br><br>`)
    );


    
    document.write('Get transaction history of user ID 2...<br><b>Request: </b>GET /transactions<br>');

    setTimeout(
        async () => {
            await fetch(
                'http://localhost:3000/transactions',
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(
                response => response.json()
            ).then(
                data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br><br>`)
            );


            document.write('Get transaction status of transaction ID 1...<br><b>Request: </b>GET /transactions/1/status<br>');

            await fetch(
                'http://localhost:3000/transactions/1/status',
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(
                response => response.json()
            ).then(
                data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br><br>`)
            );
        },
        1000
    );


}