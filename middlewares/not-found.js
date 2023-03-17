const notFound = (req, res) => {
  console.log(req.url);
  res.status(404).send(`<h1>Page not found</h1>`);
};

module.exports = notFound;
