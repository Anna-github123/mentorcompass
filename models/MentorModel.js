// Import gray-nebd and bcrypt for in memory database use and password hashing
const nedb = require("gray-nedb");
const bcrypt = require("bcrypt");

class MentorModel {
  constructor(DBFilePath) {
    if (DBFilePath) {
      this.db = new nedb({ filename: DBFilePath, autoload: true });
      console.log("Database connected to " + DBFilePath);
    } else {
      this.db = new nedb();
    }
  }

  // Inistialisation of fields of the mentor database - admin
  init() {
    this.db.insert({
      name: "Brian Dan",
      email_address: "b.dan@gmail.com",
      hash_password: bcrypt.hashSync("brian", 10),
      students: ["y.xxx@gmail.com"],
    });
    this.db.insert({
      name: "Sofia Martina",
      email_address: "s.martina@gmail.com",
      hash_password: bcrypt.hashSync("sofia", 10),
      students: ["y.xxx@gmail.com"],
    });
  }

  async getMentors() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, mentors) => {
        if (err) {
          reject(err);
          console.log("Error");
        } else {
          resolve(mentors);
          console.log("Mentor Record Retrieved");
        }
      });
    });
  }

  async insertMentor(name, email_address, students) {
    return new Promise((resolve, reject) => {
      this.db.insert(
        {
          name: name,
          email_address: email_address,
          students: students,
        },
        (err, numInserted) => {
          if (err) {
            reject(err);
            console.log("Error");
          } else {
            resolve(numInserted);
            console.log("Inserted", numInserted, "Document");
          }
        }
      );
    });
  }

  async updateMentor(id, email_address) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: id },
        { $set: { email_address: email_address } },
        {},
        (err, numUpdated) => {
          if (err) {
            console.error("Error:", err);
            reject(err);
          } else {
            console.log("Updated", numUpdated, "Document");
            resolve(numUpdated);
          }
        }
      );
    });
  }

  async deleteByMentorID(id) {
    return new Promise((resolve, reject) => {
      // { multi: true } to delete all
      this.db.remove({ _id: id }, {}, (err, numDeleted) => {
        if (err) {
          reject(err);
          console.log("Error");
        } else {
          resolve(numDeleted);
          console.log("Removed", numDeleted, "Document");
        }
      });
    });
  }

  async findByEmail(email_address) {
    return new Promise((resolve, reject) => {
      this.db.findOne(
        {
          email_address: email_address,
        },
        (err, data) => {
          if (err) {
            reject(err);
            console.log("Error");
          } else {
            resolve(data);
            console.log("User Data Found");
          }
        }
      );
    });
  }
}
//make the module visible outside
module.exports = MentorModel;
