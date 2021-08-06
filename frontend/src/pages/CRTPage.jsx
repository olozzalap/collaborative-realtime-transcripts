import React, { useEffect, useState } from 'react';

const CRTPage = () => {
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
        <main className="CRTPage">
            <h1>Bloop</h1>
            {allConvos.map( (convo) => (
                <div>
                    <h2>{convo.title}</h2>
                    <p>createdAt: {new Date(convo.createdAt).toLocaleDateString()}</p>
                    <p>lastMutationAt: {new Date(convo.lastMutationAt).toLocaleDateString()}</p>
                    <p>mutationCounts | Bob: {convo?.mutationCounts?.[0]} | Alice: {convo?.mutationCounts?.[1]}</p>
                </div>
            ))}
        </main>
    );
}

export default CRTPage;
