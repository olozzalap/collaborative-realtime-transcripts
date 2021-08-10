import React, { useEffect, useRef, useState } from 'react';

const debounceTimeMs = 900;
const renderCount = 0;

const Editor = ({
    author,
    conversation,
}) => {
    const [apiConvoText, setApiConvoText] = useState(conversation?.text);
    const [apiOrigin, setApiOrigin] = useState(conversation?.originState);
    const debounceTimer = useRef(null);

    const [mutationState, setMutationState] = useState({
        cursorIndex: null,
        isInsert: null,
        length: 0,
        newText: '',
    });
    const {
        cursorIndex,
        isInsert,
        length,
        newText,
    } = mutationState;

    const getCurrentText = () => {
        if (length === 0) {
            return apiConvoText;
        } else if (isInsert) {
            return `${apiConvoText.slice(0, cursorIndex)}${newText}${apiConvoText.slice(cursorIndex)}`
        } else {
            return `${apiConvoText.slice(0, cursorIndex - length)}${apiConvoText.slice(cursorIndex)}`
        }
    };

    const handleChange = (e) => {
        
        const value = e.target.value;

        const newMutationState = Object.assign({
            cursorIndex: event?.target?.selectionStart,
        }, mutationState);

        console.warn(`
            value is: ${value}
            cursorStart is: ${cursorStart}
        `)
        // isInsert: true
        if (value.length > apiConvoText.length) {
            newMutationState.isInsert = true;
            newMutationState.length = value.length - apiConvoText.length;
            newMutationState.newText = value.slice(cursorStart, newMutationState.length);
        } else {
            newMutationState.isInsert = false;
            newMutationState.length = apiConvoText.length - value.length;
            newMutationState.newText = '';
        }

        setMutationState(newMutationState);


        debounceTimer.current = setTimeout(() => {
            // POST /mutations
        }, debounceTimeMs);
    }

    renderCount++;
    console.warn(`
        Render #${renderCount}
        newMutationState is: `)
    console.warn(JSON.stringify(newMutationState))
    console.warn(`
        debounceTimer is: `)
    console.warn(debounceTimer)

    return (
        <div>
            <input
                aria-label="Conversation Editor"
                class="p-2"
                placeholder="Conversation Editor"
                onChange={handleChange}
                type="text"
                value={getCurrentText}
            />
        </div>
    );
}

export default Editor;
