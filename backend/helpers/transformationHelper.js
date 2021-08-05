
/*
    mutation: Mutation
    text: String
*/
const parseSingleMutation = (mutation, convoText) => {
    const {
        index,
        isInsert,
        length,
        text,
    } = mutation;

    if (isInsert) {
        return `${convoText.slice(0, index)}${text}${convoText.slice(index)}`
    } else {// deletion
        return `${convoText.slice(0, index)}${convoText.slice(index + length)}`
    }
};

/*
    mutations: [Mutation]
*/
const parseConversationText = (mutations) => {
    let text = '';
    mutations.forEach(mutation => {
        console.warn(`
            parseConversationText iteration
            mutation is: `)
        console.warn(mutation)
        text = parseSingleMutation(mutation, text);
    })
    return text;
};


module.exports = {
    parseConversationText,
    parseSingleMutation,
};