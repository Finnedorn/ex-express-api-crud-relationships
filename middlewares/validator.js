// importo i moduli checkSchema e validationResult che mi serviranno per gestire le validazioni
const { checkSchema, validationResult } = require("express-validator");

module.exports = function validator(schema) {
  return [
    // richiama il middleware di express-validator in cui definirò tutte le regole di validazione 
    checkSchema(schema),
    // questo middleware anonimo valuta se vi sono errori nella req
    (req, res, next) => {
      // estrae gli errori individuati dal checkSchema 
      const errors = validationResult(req);
      // in caso di errore stampa un json con tutti gli errori individuati 
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      next()
    }
  ]
}
