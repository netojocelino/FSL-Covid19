import auth0 from "../../../lib/auth0";
import { db } from "../../../lib/db";
import admin from "firebase-admin";


export default async function save(request, response) {
    const session = await auth0.getSession(request);

    if( session ) {
        const { status, coords } = request.body;
        const coordinates = new admin.firestore.GeoPoint(coords.lat, coords.long);
        const user = session.user.sub;
        const currentDate = (() => {
            const todays = (new Date()); return `${todays.getFullYear()}-${todays.getMonth()}-${todays.getDate()}`
        })();
    
        await db
            .collection('markers')
            .doc(currentDate)
            .collection('checks')
            .doc(user)
            .set({
                user,
                status,
                coordinates
            });
            
            response.send(request.body);
    }
        
}
