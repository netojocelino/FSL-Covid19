import React from 'react';
import router from 'next/router';
import axios from 'axios';

import auth0 from '../../lib/auth0';

export default function Create({ user, isAuth }) {

    const [data, setData] = React.useState({
        user,
        status: 'bem',
        coords: {
            lat: null, 
            long: null
        }
    });

    React.useEffect(() => {
        if( !isAuth ) {
            router.push("/");
        }
    });

    const getMyLocation = () => {
        const timeout = 10000;
        if(navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                setData( old => {
                    return ({
                        ... old,
                        coords: {
                            lat: position.coords.latitude,
                            long: position.coords.longitude
                        }
                    })
                })
            }, function() { console.error("Erro ao capturar local"); }, { timeout, maximumAge: timeout, enableHighAccuracy: true } );
        }else {
            console.error("Local não encontrado")
        }
    };

    const onChangeStatus = (evt) => {
        const value = evt.target.value;
        setData( old => {
            return ({
                ... old,
                status: value
            })
        });
    }

    const save = async () => {
        await axios.post('/api/status/save', data);
    };
    if( !isAuth ) {
        return null;
    }
    return (
        <div>
            <h1>Novo Status</h1>
            <fieldset id="status" onChange={onChangeStatus}>
                <label htmlFor="bem" className="block">
                    <input type="radio" name="status" id="bem" value="bem"/>
                    Estou bem e sem sintomas
                </label>
                <label htmlFor="gripe" className="block">
                    <input type="radio" name="status" id="gripe/resfriado" value="gripe/resfriado"/>
                    Estou com sintomas de gripe/resfriado
                </label>
                <label htmlFor="covid19" className="block">
                    <input type="radio" name="status" id="covid-19" value="covid-19"/>
                    Estou com sintomas de COVID-19
                </label>
            </fieldset>

            <p>Sua posição atual Latitude {data.coords.lat}, Longitude {data.coords.long}</p>
            <p>Status { status[data.status] }</p>
            <button onClick={getMyLocation}>Capturar Localização</button>
            <button onClick={save}>Salvar</button>
        </div>
    );
}




export async function getServerSideProps({ req, res }) {
    const session = await auth0.getSession(req);
    if(session) {
        return {
            props: {
                isAuth: true,
                user: session.user
            }
        }
    }
    return {
        props: {
            isAuth: false,
            user: { }
        }
    };
}
