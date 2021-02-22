window.onload = async function () {

    document.write('Reset database...<br>');

    await fetch(
        'http://localhost:3000',
        { method: 'POST' }
    ).then(
        response => response.json()
    ).then(
        data => document.write(`<b>Response:</b> ${data.message}<br><br>`)
    )
    
    document.write('Add first user...<br>');

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
        data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br>`)
    );

    document.write('Add second user...<br>');

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
        data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br>`)
    );

    document.write('Add currency account...<br>');

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
        data => document.write(`<b>Response:</b> ${JSON.stringify(data)}<br><br>`)
    );
}