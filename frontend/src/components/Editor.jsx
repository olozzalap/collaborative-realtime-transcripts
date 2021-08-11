import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import timesIcon from '../svg/times-circle-solid.svg';

const debounceTimeMs = 700;
let renderCount = 0;

const StyledCloseIcon = styled.svg`
    width: 40px;
    cursor: pointer;
`;
const StyledEditorInput = styled.textarea`
    margin: 24px;
    width: 100%;
    max-width: 800px;
    height: 360px;
    max-height: 100%;
`;

const Editor = ({
    author,
    conversation,
    setSelectedConversation,
}) => {
    const [displayValue, setDisplayValue] = useState(conversation?.text);
    const [apiOrigin, setApiOrigin] = useState(JSON.parse(conversation?.originState));
    const apiConvoText = useRef(conversation?.text);
    const inputRef = useRef(null);
    const debounceTimer = useRef(null);
    const mutationState = useRef({
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
    } = mutationState.current;

    const handleChange = (e) => {
        const value = e.target.value;
        const newMutationIsInsert = value.length > apiConvoText.current.length;

        if (!mutationState.current.cursorIndex) {
            mutationState.current.cursorIndex = newMutationIsInsert ? e?.target?.selectionStart - 1 : e?.target?.selectionEnd;
            console.warn(`
                set mutationState.current.cursorIndex is: ${mutationState.current.cursorIndex}
                `)
        }

        console.warn(`
            handleChange
            value is: ${value}
            apiConvoText.current.length is: ${apiConvoText.current.length}
            e?.target?.selectionStart is: ${e?.target?.selectionStart}
            cursorIndex is: ${mutationState.current.cursorIndex}
            newMutationIsInsert is: ${newMutationIsInsert}
            value.length - apiConvoText.current.length is: ${value.length - apiConvoText.current.length}
        `)
        // isInsert: true
        if (newMutationIsInsert) {
            mutationState.current.isInsert = true;
            mutationState.current.length = value.length - apiConvoText.current.length;
            mutationState.current.newText = value.slice(mutationState.current.cursorIndex, mutationState.current.cursorIndex + mutationState.current.length);
        } else {
            mutationState.current.isInsert = false;
            mutationState.current.length = apiConvoText.current.length - value.length;
            mutationState.current.newText = '';
        }

        setDisplayValue(value);
        submitMutation();
    }
    const submitMutation = async () => {
        // Debounce mutation api submission
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            console.warn(`
                debounced post!
                cursorIndex is: ${mutationState.current.cursorIndex}
                mutationState is: 
                `)
            console.warn(JSON.stringify(mutationState.current))

            const formData = new FormData();
            formData.append('conversationId', conversation?.id);
            formData.append('author', author);
            formData.append('index', mutationState.current.isInsert ? mutationState.current.cursorIndex : mutationState.current.cursorIndex);
            formData.append('type', mutationState.current.isInsert ? 'insert' : 'delete');
            formData.append('length', mutationState.current.length);
            formData.append('text', mutationState.current.newText);
            formData.append('origin', JSON.stringify(apiOrigin));

            const resp = await fetch('/mutations', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData.entries())),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const json = await resp.json();

            // success
            if (json?.ok) {
                apiConvoText.current = json?.text;

                if (json?.newIndex !== mutationState.current.cursorIndex) {
                    const newCursorIndex = inputRef?.current?.selectionStart + (json?.newIndex - mutationState.current.cursorIndex);
                    console.warn(`
                        mutationState.current.cursorIndex is: ${mutationState.current.cursorIndex}
                        inputRef?.current?.selectionStart is: ${inputRef?.current?.selectionStart}
                         newCursorIndex is: ${newCursorIndex}
                         `)
                    // eslint-disable-next-line no-unused-expressions
                    inputRef?.current?.setSelectionRange(newCursorIndex, newCursorIndex);

                    mutationState.current = {
                        cursorIndex: null,
                        isInsert: null,
                        length: 0,
                        newText: '',
                    };
                }


                setApiOrigin(json?.origin);
            } else {
                console.error (json?.msg)
            }
        }, debounceTimeMs);
    }

    renderCount++;
    console.warn(`
        Render #${renderCount}
        apiOrigin is: ${apiOrigin}
    `)

    return (
        <div>
            <div className="d-flex justify-content-around align-items-center">
                <div>
                    Origin: {JSON.stringify(apiOrigin)}
                </div>
                <div onClick={() => setSelectedConversation(null)}>
                    <StyledCloseIcon focusable="false" data-prefix="fas" data-icon="times-circle" className="text-warning" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></StyledCloseIcon>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <StyledEditorInput
                    aria-label="Conversation Editor"
                    class="p-2"
                    placeholder="Conversation Editor"
                    onChange={handleChange}
                    ref={inputRef}
                    type="text"
                    value={displayValue}
                />
            </div>
        </div>
    );
}

export default Editor;
