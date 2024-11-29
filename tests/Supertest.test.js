import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import bcrypt from "bcrypt";
import { adoptionsService } from "../src/services/index.js";

describe("Pruebas de las APIs", function () {
  this.timeout(10000);

  it("GET /api/mocks/mockingusers - debe devolver 50 usuarios de prueba", async () => {
    const response = await request(app).get("/api/mocks/mockingusers");
    expect(response.status).to.equal(201);
    expect(response.body.payload).to.be.an("array").with.lengthOf(50);
  });

  describe("Pruebas de Mascotas", () => {
    let testPetId;

    before(async () => {
      const newPet = {
        name: "Elissa",
        specie: "Perro",
        birthDate: "2003-05-15",
      };

      const response = await request(app).post("/api/pets").send(newPet);
      testPetId = response.body.payload._id;
    });

    after(async function () {
      if (testPetId) {
        await request(app).delete(`/api/pets/${testPetId}`);
        console.log("La mascota de prueba ha sido eliminada");
      }
    });

    describe("GET /api/pets", () => {
      it("debe devolver todas las mascotas", async () => {
        const response = await request(app).get("/api/pets");
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an("array");
      });
    });

    describe("POST /api/pets", () => {
      it("debe crear una mascota con éxito", async () => {
        const newPet = {
          name: "Elissa",
          specie: "Perro",
          birthDate: "2003-05-15",
        };
        const response = await request(app).post("/api/pets").send(newPet);
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.have.property("_id");

        const petId = response.body.payload._id;
        if (petId) {
          await request(app).delete(`/api/pets/${petId}`);
        }
      });

      it("debe devolver un error 400 si falta algún dato", async () => {
        const newPet = {
          name: "Elissa",
        };
        const response = await request(app).post("/api/pets").send(newPet);
        expect(response.ok).to.be.equal(false);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property("error", "Incomplete values");
      });
    });

    describe("PUT /api/pets/:pid", () => {
      it("debe actualizar una mascota con éxito", async () => {
        const updateData = {
          name: "Elissa Actualizada",
          specie: "Perro",
          birthDate: "2021-04-10",
        };
        const response = await request(app)
          .put(`/api/pets/${testPetId}`)
          .send(updateData);
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("message", "Pet updated");
      });
    });

    describe("DELETE /api/pets/:pid", () => {
      it("debe eliminar una mascota con éxito", async () => {
        const response = await request(app).delete(`/api/pets/${testPetId}`);
        expect(response.ok).to.be.equal(true);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("message", "Pet deleted");
      });
    });
  });

  // Prueba para generar solo usuarios
  it("POST /api/mocks/generateData - debe generar 20 usuarios y 1 mascota", async () => {
    const response = await request(app)
      .post("/api/mocks/generateData")
      .send({ users: 20, pets: 1 });

    expect(response.status).to.equal(201);
    expect(response.body.payload.generatedUsers)
      .to.be.an("array")
      .with.lengthOf(20);
    expect(response.body.payload.generatedPets)
      .to.be.an("array")
      .with.lengthOf(1);
  });

  // Prueba para generar solo mascotas
  it("POST /api/mocks/generateData - debe generar 20 mascotas y 1 usuario", async () => {
    const response = await request(app)
      .post("/api/mocks/generateData")
      .send({ users: 1, pets: 20 });

    expect(response.status).to.equal(201);
    expect(response.body.payload.generatedUsers)
      .to.be.an("array")
      .with.lengthOf(1);
    expect(response.body.payload.generatedPets)
      .to.be.an("array")
      .with.lengthOf(20);
  });

  // Pruebas de encriptación con bcrypt
  describe("Pruebas de encriptación con bcrypt", () => {
    const password = "passwH212";

    it("debe encriptar la contraseña correctamente", async () => {
      const hashedPassword = await bcrypt.hash(password, 10);
      expect(hashedPassword).to.not.equal(password);
    });

    it("debe coincidir la contraseña encriptada con la original", async () => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hashedPassword);
      expect(isMatch).to.be.true;
    });

    it("no debe coincidir si el hash es alterado", async () => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const alteredHash = hashedPassword.slice(0, -1);
      const isMatch = await bcrypt.compare(password, alteredHash);
      expect(isMatch).to.be.false;
    });
  });

  // Pruebas del DTO de usuario
  describe("Pruebas del DTO de usuario", () => {
    const userDTO = {
      first_name: "Nombre de Prueba",
      last_name: "Apellido de Prueba",
      email: "prueba.prueba@ejemplo.com",
      password: "passwH212",
    };

    it("debe crear el full_name a partir de first_name y last_name", () => {
      const transformedUser = {
        ...userDTO,
        full_name: `${userDTO.first_name} ${userDTO.last_name}`,
      };
      expect(transformedUser.full_name).to.equal(
        "Nombre de Prueba Apellido de Prueba"
      );
    });

    it("debe eliminar las propiedades password, first_name y last_name", () => {
      const { first_name, last_name, password, ...cleanedUserDTO } = {
        ...userDTO,
        full_name: `${userDTO.first_name} ${userDTO.last_name}`,
      };
      expect(cleanedUserDTO).to.have.property(
        "full_name",
        "Nombre de Prueba Apellido de Prueba"
      );
      expect(cleanedUserDTO).to.have.property("email", userDTO.email);
      expect(cleanedUserDTO).to.not.have.property("password");
      expect(cleanedUserDTO).to.not.have.property("first_name");
      expect(cleanedUserDTO).to.not.have.property("last_name");
    });
  });

  after(async () => {
    const adoptedPets = await adoptionsService.getAll();
    console.log("Mascotas adoptadas:", adoptedPets);
  });
});
