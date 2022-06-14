const fetch = require('node-fetch');

exports.setAdmin = async function (data, callback) {

    var adminJWT = await getAdminJWT(data);
    var tenantID = await getInstanceID(data, adminJWT);
    var user = await getUser(data, tenantID, adminJWT);
    var patch = await patchUser(data, user, adminJWT);
    callback('OK');
}

var getInstanceID = function (data, jwt) {
    return new Promise((resolve, reject) => {

        var headers = new fetch.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwt);



        var requestOptions = {
            method: 'GET',
            headers: headers,

            redirect: 'follow'
        };

        fetch(data.instance + "/api/v1/tenants", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                resolve(JSON.parse(result).data[0].id)
            })
            .catch(error => {
                console.log('error', error)
            });
    }
    )


}


var getUser = function (data, tenantID, jwt) {
    return new Promise((resolve, reject) => {

        var headers = new fetch.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwt);



        var requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        fetch(data.instance + "/api/v1/users?fields=id%2Cname%2Croles%2Cstatus%2Cemail%2Csubject%2CinviteExpiry&limit=0&status=active%2Cdisabled%2Cinvited&tenantId=" + tenantID, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                JSON.parse(result).data.forEach(element => {
                    if (element.email == data.email) {
                        resolve(element.id);
                    }
                });

            })
            .catch(error => console.log('error', error));
    }
    )


}

var patchUser = function (data, userID, jwt) {
    return new Promise((resolve, reject) => {

        var headers = new fetch.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwt);

        var raw = '[{"op":"replace","path":"/roles","value":["SharedSpaceCreator","ManagedSpaceCreator","TenantAdmin"]}]';

        var requestOptions = {
            method: 'PATCH',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        fetch(data.instance + '/api/v1/users/' + userID, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                resolve("OK");
                

            })
            .catch(error => console.log('error', error));
    }
    )


}


var getAdminJWT = function (data) {
    return new Promise((resolve, reject) => {

        var headers = new fetch.Headers();
        headers.append("Content-Type", "application/json");
        

        

        var JSONInput = JSON.stringify({
            "client_id": data.clientID,
            "client_secret": data.clientSecret,
            "grant_type": "client_credentials"
          });

        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSONInput,
            redirect: 'follow'
        };

        fetch(data.instance + "/oauth/token", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                resolve(JSON.parse(result).access_token)
            })
            .catch(error => {
                console.log('error', error)
            });
    }
    )

}

