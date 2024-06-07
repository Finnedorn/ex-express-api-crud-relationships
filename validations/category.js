const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// controllo se il parametro "name" sia corretto e che non sia già esistente in db
const nameChecker = {
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Name è un campo obbligatorio.",
      bail: true,
    },
    isString: {
      error: "Name deve essere una stringa",
      bail: true,
    },
    custom: {
      options: async (value) => {
        const nameToFind = await prisma.category.findFirst({
          where: {
            name: value,
          },
        });
        if (nameToFind) {
          throw new Error("Esiste già una Categoria con quel Name");
        }
        return true;
      },
    },
  },
};

module.exports = {
  nameChecker,
};
