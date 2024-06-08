// importo ed inizializzo prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// importo RestErrorFormatter
const RestErrorFormatter = require("../utils/restErrorFormatter");

// funzione di creazione di un elemento in db
const store = async (req, res, next) => {
  const { name } = req.body;
  try {
    const tag = await prisma.tag.create({
      data: {
        name,
      },
    });
    res.send(`Tag creato con successo: ${JSON.stringify(tag, null, 2)}`);
  } catch (error) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nella creazione del Tag: ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di recupero di tutti i più elementi dal db
const index = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
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
    const tag = await prisma.tag.findUnique({
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
    if (tag) {
      res.json(tag);
    } else {
      res.status(401).send("Tag non trovato");
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
    const tag = await prisma.tag.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    res.send(`Tag aggiornato con successo: ${JSON.stringify(tag, null, 2)}`);
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
    await prisma.tag.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json("Tag eliminato con successo");
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
