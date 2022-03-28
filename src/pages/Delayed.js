import React, { useState, useEffect } from 'react';

// type Props = {
//     children: React.ReactNode;
//     waitBeforeShow?: number;
// };

const Delayed = (props) => {
    const [isShown, setIsShown] = useState(false);
    const [waitBeforeShow, setWaitBeforeShow] = useState(5000);

    useEffect(() => {
        setTimeout(() => {
            setIsShown(true);
        }, waitBeforeShow);
    }, [waitBeforeShow]);

    return isShown ? props.children : null;
};

export default Delayed;
