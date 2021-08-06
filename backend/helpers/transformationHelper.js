
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


const transformMutation = (newMutation, oldMutations, mutationCounts) => {
    let updatedNewMutation = Object.assign({}, newMutation);
    const newMutationOrigin = newMutation.origin
    let transformIndex = oldMutations.length - 1;

    // works backwards to figure out where to start transforming from
    while (
        newMutationOrigin[0] < oldMutations[transformIndex].origin[0] ||
        newMutationOrigin[1] < oldMutations[transformIndex].origin[1]
    ) {
        const oldMutation = oldMutations[transformIndex];

        if (oldMutation.isInsert && oldMutation.index < newMutation.index) {
            newMutation.index += oldMutation.length;
        } else if (oldMutation.index <= newMutation.index) {
            newMutation.index -= oldMutation.length;
        }

        transformIndex -= 1;
    }

    const mostRecentOldMutation = oldMutations[oldMutations.length - 1];
    newMutation.origin = mostRecentOldMutation.origin;
    newMutation.origin[mostRecentOldMutation.authorIndex] += 1;

    return newMutation;
};


module.exports = {
    parseConversationText,
    parseSingleMutation,
    transformMutation,
};