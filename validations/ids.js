const idChecker = {
    id: {
        in: ["params"],
        isInt: {
            error: "l'ID deve essere un numero intero"
        },
        custom: {
            options: async(id) => {
                const idToCheck = parseInt(id);
                if(isNaN(idToCheck)) {
                    throw new Error('l\'\ ID deve essere un numero');
                }
                return true;
            }
        }
    }
}

module.exports = {
    idChecker
}