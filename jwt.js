const jsonwebtoken = require('jsonwebtoken');

var jwtPayload = {
    jti: '', // 32 bytes random string
    sub: '',
    subType: 'user',
    name: '',
    email: '',
    email_verified: true,
    groups: ['Admin', 'Finance', 'Marketing', 'Sales1'],
};

var jwtSigningOptions = {
    keyid: '',
    algorithm: 'RS256',
    issuer: '',
    expiresIn: '30m',
    notBefore: '0s',
    audience: 'qlik.api/login/jwt-session'
};

var jwtPrivateKey = '';

exports.getJWT = async function (input, callback) {
    jwtPayload.jti = input.jti;
    jwtPayload.sub = input.sub;
    jwtPayload.name = input.name;
    jwtPayload.email = input.email;


    jwtSigningOptions.keyid = input.keyid;
    jwtSigningOptions.issuer = input.issuer;
    jwtPrivateKey = input.key;

    
    var token = jsonwebtoken.sign(jwtPayload, jwtPrivateKey, jwtSigningOptions);
     callback(token);


}




