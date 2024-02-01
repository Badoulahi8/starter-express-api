const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const cookie = require('cookie');
const endpoint = 'https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql';
// const { GraphQLClient } = require('graphql-request');

const controller = {
    homeHandleRequest: async (req, res) => {
        const loginPath = path.join(__dirname, '../views', 'index.html');
        fs.readFile(loginPath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Erreur interne du serveur');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    },
    getTokenHandleRequest: async (req, res) => {
        let token = getToken(req)
        if (await isValidToken(token)) {
            res.end(JSON.stringify({ success: true, token: token }));
        } else {
            res.end(JSON.stringify({ success: false, token: "" }));
        }
    },
    loginHandleRequest: (req, res) => {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                const formData = querystring.parse(body);
                const formDataJSONString = Object.keys(formData)[0];

                try {
                    const formDataObject = JSON.parse(formDataJSONString);
                    const { username, password } = formDataObject;
                    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
                    const signInEndpoint = 'https://learn.zone01dakar.sn/api/auth/signin';
                    try {
                        const myHeaders = new Headers();
                        myHeaders.append("Authorization", `Basic ${credentials}`);
                        const requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            redirect: 'follow',
                        };
                        const response = await fetch(signInEndpoint, requestOptions);
                        const responseData = await response.json();
                        if (response.ok) {
                            createToken(res, responseData)
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true, token: responseData }));
                        } else {
                            // res.writeHead(response.status, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: responseData.error }));
                        }
                    } catch (error) {
                        console.error('Error during login:', error);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'analyse de la chaîne JSON:', error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
            });
        }
    },
    errorHandleRequest: (req, res, error) => {
        if (error.status === 404) {
            const errorPath = path.join(__dirname, '../views', 'error.html');
            fs.readFile(errorPath, 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Erreur interne du serveur');
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(error.status, { 'Content-Type': 'text/plain' });
            res.end(error.text);
        }
    },
    logoutHandleRequest: (req, res) => {
        if (req.method === 'POST') {
            deleteToken(res);
            res.end(JSON.stringify({ success: true }));
        }
    },
    getUserDatas: async (req, res) => {
        const graphQLClient = new GraphQLClient(endpoint, {
            headers: {
                Authorization: `Bearer ${getToken(req)}`,
            },
        });

        const query = `
            query{
                    user {
                        id
                        login
                        email
                        firstName
                        lastName
                        totalDown
                        totalUp
                    }
                    level:transaction(
                        where: {
                            type: { _eq: "level" },
                            path: { _like: "%/dakar/div-01%" }
                        }
                        order_by:{ 
                            amount: desc
                        }
                        limit:1
                    ){
                        amount
                    }
                    xpTotal: transaction_aggregate(
                        where: {
                            type: {_eq: "xp"}, 
                            eventId: {_eq: 56}
                        }
                    ){
                        aggregate {
                            sum {
                                amount
                            }
                        }
                    }
                    skills: transaction(
                        order_by: {
                            type: asc, 
                            createdAt: desc,
                            amount:desc
                        }
                        distinct_on: [type]
                        where: {
                            eventId: {_eq: 56}, 
                            _and: {type: {_like: "skill_%"}}
                        }
                    ){
                        type
                        amount
                    }
                    xp: transaction(
                        order_by: {amount: desc}
                        where: {
                          type: {_eq: "xp"}
                          eventId: {_eq: 56}
                          path: { _nlike: "%/dakar/div-01/checkpoint%" }
                        }
                    ){
                        amount
                        path
                    }
                }
        `;
        try {
            const data = await graphQLClient.request(query);
            res.end(JSON.stringify({ success: true, datas: data }))
        } catch (error) {
            res.end(JSON.stringify({ success: false, datas: {} }))
        }
    }
};

function createToken(res, newToken) {
    const tokenCookie = cookie.serialize('token', newToken, {
        path: '/',
        secure: true,
        httpOnly: true,
    });

    res.setHeader('Set-Cookie', [tokenCookie]);
}

function getToken(req) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    return token
}

async function isValidToken(token) {
    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const query = `
        query {
                user {
                  id
                }
            }
    `;
    try {
        const data = await graphQLClient.request(query);
        return true
    } catch (error) {
        return false
    }
}

const { GraphQLClient } = require('graphql-request');


function deleteToken(res) {
    const expiredTokenCookie = cookie.serialize('token', '', {
        path: '/',
        expires: new Date(0),
        httpOnly: true,
        secure: true,
    });
    res.setHeader('Set-Cookie', [expiredTokenCookie]);
}

module.exports = controller;
