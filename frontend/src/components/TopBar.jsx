import React, { useEffect, useState } from 'react';


const TopBar = ({
    author,
    setAuthor,
}) => {
    const [newAuthorText, setNewAuthorText] = useState(author);

    return (
        <header className="bg-secondary text-white d-flex align-items-center justify-content-around">
            <div className="d-flex align-items-center p-2">
                <label>
                    Author: 
                </label>
                <input
                    aria-label="Author"
                    class="form-control mx-2"
                    placeholder="Author"
                    onChange={e => setNewAuthorText(e?.target?.value)}
                    type="text"
                    value={newAuthorText}
                />
                <button
                    type="button"
                    class="btn btn-success"
                    onClick={setAuthor(newAuthorText)}
                >
                    Update
                </button>
            </div>
            <h1 className="p-2">
                C.R.T. 📺
            </h1>
        </header>
    );
}

export default TopBar;
