const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// controllo che lo slug passato per la ricerca dell'elemento in db non sia errato
// o non corrispondente ad alcuno slug già presente in db 
const slugChecker = {
    slug: {
        in: ["params"],
        isString: {
            error:"Lo Slug deve essere una stringa",
            bail:true
        },
        custom : {
            options: async(slug) =>{
                const slugToFind = await prisma.post.findFirst({
                    where: {
                        slug : slug
                    }
                })
                if(!slugToFind){
                    throw new Error('slug errato o non corrispondente');
                }
                return true;
            }
        }
    }
}

// controllo che i parametri inviati per la creazione di un nuovo elemento in db siano corretti
// per gli elementi in relazione, effettuo un controllo per capire se i parametri corrispondono
// ad elementi effettivamente presenti in db 
const bodyChecker = {
    title: {
        in: ["body"],
        notEmpty: {
            error: "Title è un campo obbligatorio",
            bail: true
        },
        isString: {
            error: "Title deve essere una stringa",
            bail: true
        }
    },
    content: {
        in: ["body"],
        notEmpty: {
            error: "Content è un campo obbligatorio",
            bail: true
        },
        isString: {
            error: "Content deve essere una stringa",
            bail: true
        },
    },
    published: {
        in: ["body"],
        isBoolean: {
            error: "Published deve essere un booleano"
        }
    },
    categoryId: {
        in: ["body"],
        isInt: {
            error : "Cagetory Id deve essere un numero"
        },
        custom: {
            options: async (value) => {
                const categoryId = parseInt(value);
                const categoryToFind = await prisma.category.findFirst({
                    where: {
                        id : categoryId
                    }
                });
                if(!categoryToFind){
                    throw new Error ('Category Id errato o non esistente');
                }
                return true;
            }
        }
    },
    tags: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Tags è un campo obbligatorio.",
            bail: true
        },
        isArray: {
            error : "Tags deve essere un array"
        },
        custom: {
            options: async (array) => {
                if(array.length === 0){
                    throw new Error('i Tags devono contenere almeno un elemento');
                }
                const notIntegerId = array.find(el => isNaN(parseInt(el)));
                if(notIntegerId){
                    throw new Error('Uno o più ID di Tags non sono costituiti da numeri interi');
                }
                const tagsToFind = await prisma.tag.findMany({
                    where: {
                        id : {
                            in: {
                                array
                            }
                        }
                    }
                });
                if(tagsToFind.length !== array.length){
                    throw new Error ('Uno o più elementi fra i Tags inseriti non è corretto o non esiste');
                }
                return true;
            }
        }
    }
}

module.exports={
    slugChecker,
    bodyChecker
}