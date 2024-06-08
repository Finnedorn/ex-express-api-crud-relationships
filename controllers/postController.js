// importo ed inizializzo prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// importo RestErrorFormatter
const RestErrorFormatter = require("../utils/restErrorFormatter");
// importo slugify
const slugify = require("slugify");

// funzione di creazione di uno slug unique
const createUniqueSlug = async (title) => {
  let slug = slugify(title, { lower: true });
  let uniqueSlug = slug;
  let count = 1;

  // Verifica se lo slug esiste già nel database
  while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
};

// funzione di creazione di un elemento in db
const store = async (req, res, next) => {
  const { title, content, published, categoryId, tags } = req.body;
  try {
    const slug = await createUniqueSlug(title);
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published,
        categoryId,
        tags: {
          connect: tags.map((tag) => ({ id: tag })),
        },
      },
    });
    res.send(`Post creato con successo: ${JSON.stringify(post, null, 2)}`);
  } catch (error) {
    // storo in una const la nuova istanza di RestErrorFormatter contente lo status e il message da me personlizzato
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nella creazione del post: ${error}`
    );
    // passo il tutto che verrà intercettato dal middleware di gestione errori (allErrorFormatter)
    next(errorFormatter);
  }
};

// funzione di recupero di tutti i più elementi dal db, filtrati e paginati
const index = async (req, res, next) => {
  try {
    // creo una const dove storerò gli elementi
    //  con cui poi effettuerò la ricerca filtrata in prisma
    const where = {};
    // estrapolo dalla query ogni possobile parametro su cui filtrerò
    const { published, content, title, page = 1, limit = 10 } = req.query;

    // controllo gli elementi in query
    // ed ne storo i valori in where
    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    if (content) {
      // equivale a scrivere where: {
      //     content: { contains: content }
      // }
      where.content = { contains: content };
    }

    if (title) {
      where.title = { contains: title };
    }

    // gestisco la paginazione
    const offsetPage = (page - 1) * limit;
    const totalItems = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      skip: offsetPage,
      include: {
        category: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(posts, parseInt(page), totalPages, totalItems);
  } catch (error) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per la ricerca: ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di recupero di un elemento singolo tramite slug
const show = async (req, res, next) => {
  try {
    // estraggo lo slug dai params
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
    if (slug) {
      res.json(post);
    } else {
      res.status("401").send("errore");
    }
  } catch (error) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per la ricerca: ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di update di un elemento selezionato tramite slug
const update = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { title, content, published, categoryId, tags } = req.body;
    const post = await prisma.post.update({
      where: {
        slug,
      },
      data: {
        title,
        content,
        published,
        categoryId,
        tags: {
          set: tags.map((id) => ({ id })),
        },
      },
    });
    res.send(`Post aggiornato con successo: ${JSON.stringify(post, null, 2)}`);
  } catch {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per l'operazione di update : ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di delete di un elemento selezionato tramite slug
const destroy = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.delete({
      where: {
        slug,
      },
    });
    res.send("Post eliminato con successo");
  } catch {
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
