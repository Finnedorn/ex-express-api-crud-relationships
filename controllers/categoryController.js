// importo ed inizializzo prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// importo RestErrorFormatter
const RestErrorFormatter = require("../utils/restErrorFormatter");

// funzione di creazione di un elemento in db
const store = async (req, res, next) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.send(`Categoria creata con successo: ${category}`);
  } catch (error) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nella creazione della Categoria: ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di recupero di tutti i più elementi dal db
const index = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nella richiesta di visualizzazione: ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di recupero di un elemento selezionato tramite id
const show = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        posts: {
          select: {
            title: true,
          },
        },
      },
    });
    if (category) {
      res.json(category);
    } else {
      res.status(401).send("Categoria non trovata");
    }
  } catch (err) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per la ricerca: ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di update di un elemento selezionato tramite id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    res.send(
      `Categoria aggiornata con successo: ${JSON.stringify(category, null, 2)}`
    );
  } catch (err) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per l'operazione di update : ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di delete di un elemento selezionato tramite id
const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json("Categoria eliminata con successo");
  } catch (err) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati l'operazione di delete : ${error}`
    );
    next(errorFormatter);
  }
};

module.exports = {
  store,
  index,
  show,
  update,
  destroy,
};
