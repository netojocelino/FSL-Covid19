import auth0 from '../../lib/auth0';

export default async function callback(request, response) {
    await auth0.handleCallback(request, response, {
        redirectTo: '/app'
    })
}
