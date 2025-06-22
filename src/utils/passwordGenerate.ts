/*
    This function is only to create a secret key for JSONWEBTOKEN.
*/

const keyword = 'PROYECTODEVACUNACIÓN'
const password = Bun.password.hashSync(keyword);

console.log(password); 