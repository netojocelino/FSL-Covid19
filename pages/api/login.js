import auth0 from '../../lib/auth0';

export default async function login (request, response) {
    await auth0.handleLogin(request, response);
}
