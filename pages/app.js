import React from 'react';
import router from 'next/router';

import auth0 from '../lib/auth0';
import { db } from '../lib/db'

import distance from '../lib/geodistance';


export default function App({ user, isAuth, forceCreate, checkins }) {
    
    React.useEffect(() => {
        if( ! isAuth ) {
            router.push('/401');
        }
        if( forceCreate ) {
            router.push('/status/create')
        }
    });

    if(!isAuth || forceCreate) {
        return null;
    }
    return (
        <div>
            <h1>Status próximos</h1>
            <hr/>
            {
              checkins.length > 0  ? (
                    <table className="w-full">
                        <thead className="bg-blue-300 text-white">
                            <tr>
                                <td className="font-bold">#</td>
                                <td className="font-bold">Status</td>
                                <td className="font-bold">Coordenadas</td>
                                <td className="font-bold">Distância (quilometros)</td>
                            </tr>
                        </thead>
                        <tbody>
                            { checkins.map( (checkin, index) => (
                                <tr key={checkin.id} className={ ((index%2) == 1) ? "bg-blue-100" : "" }>
                                    <td style={{ width: 300, paddingHorizontal: 5 }}>{checkin.id === user.sub && "Seu status"}</td>
                                    <td style={{ width: 150, paddingHorizontal: 5 }}>{checkin.status}</td>
                                    <td style={{ width: 200, paddingHorizontal: 5 }}>{checkin.coords.lat} : {checkin.coords.long}</td>
                                    <td style={{ width: 100, paddingHorizontal: 5 }}>{checkin.distance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <h4>Nenhum registro próximo</h4>
                )
            }
        </div>
    );
}

export async function getServerSideProps({ req, res }) {
    const currentDate = (() => {
            const todays = (new Date());
            return `${todays.getFullYear()}-${todays.getMonth()}-${todays.getDate()}`
        })();

    const session = await auth0.getSession(req);
    
    if(session) {
    
        const todaysCheckin  = await db
                    .collection('markers')
                    .doc(currentDate)
                    .collection('checks')
                    .doc(session.user.sub)
                    .get();
        const todaysData = todaysCheckin.data();
        let forceCreate = true;
        const checkinsList = [];
        
        if(todaysData) {
        
            forceCreate = false;

            const checkins = await db
                .collection('markers')
                .doc(currentDate)
                .collection('checks')
                .near({
                    center: todaysData.coordinates,
                    radius: 1000
                })
                .get();
            
            
            checkins.docs.forEach( function(doc) {
                const {
                        status,
                        coordinates
                      } = doc.data();
                checkinsList.push({
                    id: doc.id,
                    status,
                    coords: {
                        lat: coordinates.latitude,
                        long: coordinates.longitude
                    },
                    distance: distance(
                                    todaysData.coordinates.latitude, //-10.687233,
                                    todaysData.coordinates.longitude, //-37.432934
                                    coordinates.latitude,
                                    coordinates.longitude
                            )
                });
                
            })
        }
        return {
            props: {
                isAuth: true,
                user: session.user,
                forceCreate: false,
                checkins: checkinsList
            }
        }
    }
    return {
        props: {
            isAuth: false,
            user: { },
            forceCreate: false
        }
    };
}
