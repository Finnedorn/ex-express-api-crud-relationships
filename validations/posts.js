const { checkSchema, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const slugChecker = {
    slug: {
        in: ["params"],
        isString: {
            error:"Lo Slug deve essere una stringa",
            bail:true
        },
        custom : {
            options: async(slug) =>{
                const slugToFind = await prisma.post.findUnique({
                    where: {
                        slug : slug
                    }
                })
                if(slugToFind){
                    return true;
                }else {
                    throw new Error('slug errato o non corrispondente')
                }
            }
        }
    }
}

module.exports={
    slugChecker
}