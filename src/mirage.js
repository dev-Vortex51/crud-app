import { createServer } from "miragejs";

export function makeServer() {
  createServer({
    routes() {
      this.namespace = "/api";

      // Load initial data from localStorage if available
      const initialEmployees = JSON.parse(
        localStorage.getItem("employees")
      ) || [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          salary: 50000,
          hireDate: "2023-06-15",
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          salary: 60000,
          hireDate: "2003-06-09",
        },
      ];

      this.db.loadData({
        employees: initialEmployees,
      });

      this.get("/employees", () => {
        return this.db.employees;
      });

      this.post("/employees", (schema, request) => {
        const newEmployee = JSON.parse(request.requestBody);
        this.db.employees.insert(newEmployee);

        localStorage.setItem("employees", JSON.stringify(this.db.employees));
        return newEmployee;
      });

      this.put("/employees/:id", (schema, request) => {
        const id = request.params.id;
        const updatedEmployee = JSON.parse(request.requestBody);
        this.db.employees.update(id, updatedEmployee);

        localStorage.setItem("employees", JSON.stringify(this.db.employees));
        return updatedEmployee;
      });

      this.delete("/employees/:id", (schema, request) => {
        const id = request.params.id;
        this.db.employees.remove(id);

        localStorage.setItem("employees", JSON.stringify(this.db.employees));
        return { message: `Employee with ID ${id} deleted` };
      });
    },
  });
}
