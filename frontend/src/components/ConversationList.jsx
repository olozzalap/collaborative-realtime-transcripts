import React, { useEffect, useState } from 'react';

const ConversationList = ({
    setSelectedConvo,
}) => {
    const [allConvos, setAllConvos] = useState([]);

    useEffect(() => {
        const fetchAllConvos = async () => {
            const allConvosRes = await fetch('http://localhost:4000/conversations');
            const allConvosJson = await allConvosRes.json();
            setAllConvos(allConvosJson)
        };
        if (!allConvos?.length) {
            fetchAllConvos();
        }
    }, []);

    console.warn(allConvos)


    return (
        <main className="ConversationList">
            <h1>Bloop</h1>
            {allConvos.map( (convo) => (
                <div onClick={() => setSelectedConvo(convo)}>
                    <h2>{convo.title}</h2>
                    <p>createdAt: {new Date(convo.createdAt).toLocaleDateString()}</p>
                    <p>lastMutationAt: {new Date(convo.lastMutationAt).toLocaleDateString()}</p>
                    <p>originState | {JSON.stringify(convo?.originState)}</p>
                    <p>Mutations</p>
                </div>
            ))}
        </main>
    );
}

export default ConversationList;
