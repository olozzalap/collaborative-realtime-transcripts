import React, { useEffect, useState } from 'react';
import ConversationList from '../components/ConversationList';
import Editor from '../components/Editor';
import TopBar from '../components/TopBar';

const defaultAuthors = ['Bob', 'Alice'];

const CRTPage = () => {
    // Initially set a random author from defaultAuthors, user can change this
    const [author, setAuthor] = useState(defaultAuthors[Math.floor(Math.random() * defaultAuthors.length)]);
    const [selectedConversation, setSelectedConversation] = useState(null);

    return (
        <main id="CRTPage">
            <TopBar 
                author={author}
                setAuthor={setAuthor}
            />
            {selectedConversation ? 
                <Editor
                    author={author}
                    conversation={selectedConversation}
                /> :
                <ConversationList
                    setSelectedConversation={setSelectedConversation}
                />
            }
        </main>
    );
}

export default CRTPage;
