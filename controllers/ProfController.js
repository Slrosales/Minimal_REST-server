import { loadData } from "../data.js";

const ProfController = {
  getAll(req, res) {
    try {
      const data = loadData();

      res.status(200).json({
        _links: { self: { href: "/profs" } },
        profs: data.profs.map((p) => ({
          lastname: p.lastname,
          firstname: p.firstname,
          number: p.number,
          _links: {
            self: {
              href: `/profs/${p.number}`,
            },
          },
        })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not read profs data" });
    }
  },

  getOne(req, res) {
    try {
      const data = loadData();
      const prof = data.profs.find((p) => p.number === req.params.number);

      if (!prof) {
        return res.status(404).json({ error: "prof not found" });
      }

      res.status(200).json(prof);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not read prof data" });
    }
  },
};
export default ProfController;
