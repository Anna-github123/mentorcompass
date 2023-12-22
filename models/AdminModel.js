// Import gray-nebd and bcrypt for in memory database use and password hashing
const nedb = require("gray-nedb");
const bcrypt = require("bcrypt");

class AdminModel {
  constructor(DBFilePath) {
    if (DBFilePath) {
      this.db = new nedb({ filename: DBFilePath, autoload: true });
      console.log("Database connected to " + DBFilePath);
    } else {
      this.db = new nedb();
    }
  }

  // Inistialisation of fields of the admin database - admin
  init() {
    this.db.insert({
      name: "John Doe",
      email_address: "j.doe@gmail.com",
      hash_password: bcrypt.hashSync("joe", 10),
    });
  }

  async insertMentor(name, email_address, hash_password, opportunities) {
    return new Promise((resolve, reject) => {
      this.db.insert(
        {
          name: name,
          email_address: email_address,
          hash_password: hash_password,
          opportunities: opportunities,
        },
        (err, numInserted) => {
          if (err) {
            reject(err);
            console.log("Error");
          } else {
            resolve(numInserted);
            console.log("Mentor Inserted");
          }
        }
      );
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
            console.log("Mentor Record Retrieved");
          }
        }
      );
    });
  }
}
//make the module visible outside
module.exports = AdminModel;
