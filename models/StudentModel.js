// Import gray-nebd and bcrypt for in memory database use and password hashing
const nedb = require("gray-nedb");
const bcrypt = require ("bcrypt");

class StudentModel {
  constructor(DBFilePath) {
    if (DBFilePath) {
      this.db = new nedb({ filename: DBFilePath, autoload: true });
      console.log("Database connected to " + DBFilePath);
    } else {
      this.db = new nedb();
    }
  }  

  // Inistialisation of fields of the student database - admin
  init() {
    this.db.insert({
      name: "Yovien xxx",
      email_address: "y.xxx@gmail.com",
      hash_password: bcrypt.hashSync("yovien", 10),
      opportunities: [],
      //mentor's email in stored in this array - student obeject has the emails of the student's mentors
      mentors: ["b.dan@gmail.com", "s.martina@gmail.com"],
    });
  }

  async getStudents () {
    return new Promise((resolve, reject) => {
      this.db.find({},(err, students) => {
        if (err) {
          reject (err);
          console.log("Error")
        }
        else {
          resolve (students)
          console.log("Student Record Retrieved")
        }
      })
    })
  }

  async insertStudent(name, email_address, hash_password, opportunities, mentors) {
    return new Promise((resolve, reject) => {
      this.db.insert({
        name: name,
        email_address: email_address,
        hash_password: hash_password,
        opportunities: opportunities,
        mentors: mentors,
      },(err, numInserted) => {
        if (err) {
          reject (err);
          console.log("Error")
        }
        else {
          resolve (numInserted)
          console.log("Inserted", numInserted, "Document")
        }
      })
    })
  }

  async updateStudent(id, email_address) {
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

  async deleteByStudentID(id) {
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
      this.db.findOne({
        email_address: email_address,
      },(err, data) => {
        if (err) {
          reject (err);
          console.log("Error")
        }
        else {
          resolve (data)
          console.log("User Data Found")
        }
      })
    })
  }
} 
//make the module visible outside
module.exports = StudentModel;