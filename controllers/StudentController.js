import { loadData } from "../data.js";

const StudentController = {
  getAll(req, res) {
    try {
      const data = loadData();

      res.status(200).json({
        _links: { self: { href: "/students" } },
        students: data.students.map((s) => ({
          lastname: s.lastname,
          firstname: s.firstname,
          _links: {
            self: {
              href: `/students/${s.ine}`,
            },
          },
        })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not read students data" });
    }
  },

  getOne(req, res) {
    try {
      const data = loadData();
      const student = data.students.find((s) => s.ine === req.params.ine);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not read student data" });
    }
  },
};
export default StudentController;
