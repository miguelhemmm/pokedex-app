import { useEffect, useRef, useState } from 'react';

export function useCustomState(init) {
    const [state, setState] = useState(init);
    const cbRef = useRef();

    const setCustomState = (newState, callback) => {
        cbRef.current = callback;
        setState(newState);
    };

    useEffect(() => {
        if (cbRef.current) {
            cbRef.current(state);
        }
        cbRef.current = undefined;
    }, [state]);

    return [state, setCustomState];
}