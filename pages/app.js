import React from 'react';

import auth0 from '../lib/auth0';

export default function App({ user }) {
    return (
        <div>
            <h1>App</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
}

export async function getServerSideProps({ req, res }) {
    const session = await auth0.getSession(req);
    if(session) {
        return {
            props: {
                user: {
                    name: session.user
                }
            }
        }
    }
    return {
        props: {
            user: {
                
            }
        }
    };
}
