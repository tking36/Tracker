import { useState, useEffect } from "react";
import { Accuracy, requestForegroundPermissionsAsync, watchPositionAsync } from "expo-location";

export default (shouldTrack, callback) => {

    const [err, setErr] = useState(null);
    const [subscriber, setSubscriber] = useState(null);

    const startWatching = async () => {
        try {
            await requestForegroundPermissionsAsync();
            const sub = await watchPositionAsync({
                accuracy: Accuracy.BestForNavigation,
                timeInterval: 1000,
                distanceInterval: 10
            }, callback
            );
            setSubscriber(sub);
        } catch (e) {
            setErr(e);
        }
    };

   
    useEffect(() => {
        if (shouldTrack) {
            startWatching();
        } else {
            if (subscriber) {
                subscriber.remove();
            }
            setSubscriber(null);
        }
    });
 
    
    return [err];
}
