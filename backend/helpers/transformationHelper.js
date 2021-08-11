
/*
    mutation: Mutation
    text: String
*/
const parseSingleMutation = (mutation, convoText) => {
    // console.warn(`
    //     parseSingleMutation
    //     mutation is: ${JSON.stringify(mutation)}
    //     convoText is: ${convoText}
    // `);
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
        text = parseSingleMutation(mutation, text);
    })
    return text;
};


const transformMutation = (newMutation, existingMutations) => {
    let updatedNewMutation = Object.assign({}, newMutation);
    const newMutationOrigin = updatedNewMutation.origin;
    const newMutationOriginKeys = Object.keys(newMutationOrigin);
    let transformIndex = existingMutations.length - 1;


    // Iterate backwards over mutations till we're back to matching origins and can proceed with mutation
    while (
        newMutationOriginKeys.length !== Object.keys(existingMutations[transformIndex].origin).length || 
        newMutationOriginKeys.find(author => newMutationOrigin[author] < existingMutations[transformIndex].origin[author])
    ) {
        const existingMutation = existingMutations[transformIndex];

        if (existingMutation.isInsert && existingMutation.index < updatedNewMutation.index) {
            updatedNewMutation.index += existingMutation.length;
        } else if (!existingMutation.isInsert && existingMutation.index <= updatedNewMutation.index) {
            updatedNewMutation.index -= existingMutation.length;
        }

        transformIndex -= 1;
    }

    const mostRecentExistingMutation = existingMutations[existingMutations.length - 1];
    updatedNewMutation.origin = mostRecentExistingMutation.origin;
    updatedNewMutation.origin[mostRecentExistingMutation.author] += 1;

    return updatedNewMutation;
};


module.exports = {
    parseConversationText,
    parseSingleMutation,
    transformMutation,
};