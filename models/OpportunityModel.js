// Import gray-nebd and bcrypt for in memory database use, password hashing and category
const nedb = require("gray-nedb");
const bcrypt = require("bcrypt");
const opportunityCategory = require("../models/constants");

class OpportunityModel {
  constructor(DBFilePath) {
    if (DBFilePath) {
      this.db = new nedb({ filename: DBFilePath, autoload: true });
      console.log("Database connected to " + DBFilePath);
    } else {
      this.db = new nedb();
    }
  }

  // Inistialisation of fields of the opportunity database - admin
  init() {
    this.db.insert({
      category: opportunityCategory.CAREERADVICE,
      title: "Professsional Speaking",
      name: "Yovien xxx",
      email_address: "y.xxx@gmail.com",
    });
  }

  async getOpportunities() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, opportunities) => {
        if (err) {
          reject(err);
          console.log("Error");
        } else {
          resolve(opportunities);
          console.log("Opportunity Retrieved");
        }
      });
    });
  }

  async findByID(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne(
        {
          _id: id,
        },
        (err, data) => {
          if (err) {
            reject(err);
            console.log("Error");
          } else {
            resolve(data);
            console.log("Opportunity Retrieved");
          }
        }
      );
    });
  }

  async findAllByEmail(email_address) {
    return new Promise((resolve, reject) => {
      this.db.find({ email_address: email_address }, (err, opportunities) => {
        if (err) {
          reject(err);
          console.log("Error");
        } else {
          resolve(opportunities);
          console.log("Opportunities Retrieved");
        }
      });
    });
  }

  async insertOpportunity(category, title) {
    return new Promise((resolve, reject) => {
      this.db.insert(
        {
          category: category,
          title: title,
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

  async insertParticipation(category, title, name, email_address) {
    return new Promise((resolve, reject) => {
      this.db.insert(
        {
          category: category,
          title: title,
          name: name,
          email_address: email_address,
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

  async updateParticipation(id, category) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: id },
        { $set: { category: category } },
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

  async deleteByID(id) {
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
}

//make the module visible outside
module.exports = OpportunityModel;
