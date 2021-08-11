import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const StyledConvoCard = styled.div`
    cursor: pointer;
    transition: 300ms;
    &:hover {
        background-color: rgba(215, 210, 239, .5);
    }
`;
const StyledDeleteIcon = styled.svg`
    min-width: 16px;
    max-width: 16px;
    transition: 300ms;
    &:hover {
        color: rgb(224, 45, 109);
    }
`;
const StyledCreateIcon = styled.svg`
    min-width: 64px;
    max-width: 64px;
    padding: 32px 0;
    transition: 300ms;
    &:hover {
        color: rgb(65, 125, 219);
    }
`;

const ConversationList = ({
    author,
    setSelectedConversation,
}) => {
    const [allConvos, setAllConvos] = useState([]);
    const [newConvoTitle, setNewConvoTitle] = useState('');

    useEffect(() => {
        const fetchAllConvos = async () => {
            const allConvosRes = await fetch('/conversations');
            const allConvosJson = await allConvosRes.json();
            setAllConvos(allConvosJson)
        };
        if (!allConvos?.length) {
            fetchAllConvos();
        }
    }, []);

    console.warn(allConvos)

    const deleteConvo = async (e, id) => {
        console.warn(`
            deleteConvo
            `)
        e.preventDefault();
        e.stopPropagation();

        const resp = await fetch('/conversations', {
            method: 'DELETE',
            body: JSON.stringify({ "id": id }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await resp.json();

        // success
        if (json?.ok) {
            const newConvos = allConvos.filter((convo) => {
                return convo.id !== id
            });
            setAllConvos(newConvos);
        } else {
            console.error (json?.msg)
        }
    }

    const createConvo = async () => {
        console.warn(`
            createConvo
            `)

        const resp = await fetch('/conversations', {
            method: 'POST',
            body: JSON.stringify({ "author": author, "title": newConvoTitle }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await resp.json();

        // success
        if (json?.ok) {
            // const newConvos = allConvos.filter((convo) => {
            //     return convo.id !== id
            // });
            const newConvo = json?.newConversation;
            newConvo.text = json?.text;
            newConvo.id = newConvo._id;

            setAllConvos([
                ...allConvos,
                newConvo
            ]);

            setNewConvoTitle('')
        } else {
            console.error (json?.msg)
        }
    }


    return (
        <main className="ConversationList row m-3">
            {allConvos.map( (convo) => (
                <div className="col-md-4 col-sm-6 col-12 pb-3">
                    <StyledConvoCard className="card" onClick={() => setSelectedConversation(convo)}>
                        <div className="card-body">
                            <h3 className="card-title d-flex justify-content-between">
                                <span>{convo.title}</span>
                                <StyledDeleteIcon onClick={(e) => deleteConvo(e, convo.id)} focusable="false" data-prefix="fas" data-icon="trash-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></StyledDeleteIcon>
                            </h3>
                            <p className="card-text">createdAt: {new Date(convo.createdAt).toLocaleDateString()}</p>
                            <p className="card-text">lastMutationAt: {new Date(convo.lastMutationAt).toLocaleDateString()}</p>
                            <p className="card-text">originState | {JSON.stringify(convo?.originState)}</p>
                            <h6 className="card-subtitle my-2 text-muted">
                                "{convo?.text?.slice(0, 100)}"
                            </h6>
                        </div>
                    </StyledConvoCard>
                </div>
            ))}
            <div className="col-md-4 col-sm-6 col-12">
                <StyledConvoCard className="card">
                    <h3 className="card-title d-flex justify-content-center">
                        New transcript?
                    </h3>

                    <label className="card-text d-flex justify-content-around">
                        Title: 
                        <input
                            onChange={(e) => setNewConvoTitle(e.target.value)}
                            placeholder="Title"
                            value={newConvoTitle}
                        />
                    </label>

                    <div className="d-flex justify-content-center">
                        <StyledCreateIcon onClick={createConvo} focusable="false" data-prefix="fas" data-icon="plus-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></StyledCreateIcon>
                    </div>
                </StyledConvoCard>
            </div>
        </main>
    );
}

export default ConversationList;
