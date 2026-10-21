import { loadData } from "../data.js";

const ModuleController = {
  getAll(req, res) {
    try {
      const data = loadData();

      res.status(200).json({
        _links: { self: { href: "/modules" } },
        modules: data.modules.map((m) => ({
          name: m.code_module,
          _links: {
            self: {
              href: `/modules/${m.code_module}`,
            },
          },
        })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not read module data" });
    }
  },
};

export default ModuleController;
