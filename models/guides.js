const { promise, reject } = require('bcrypt/promises');
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;


const getAllGuides = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM guides', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


const createGuide = (guideDetails) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO Guides 
            (national_id, full_name, dob, gender, email, postal_address, registration_status, date_of_registration)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const values = [
            guideDetails.national_id,
            guideDetails.full_name,
            guideDetails.dob || null,
            guideDetails.gender || null,
            guideDetails.email,
            guideDetails.postal_address || null,
            guideDetails.registration_status || "Pending Review"
        ];

        pool.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId); // return guide_id
        });
    });
};

// ---------------- ADD DOCUMENTS ----------------
const addGuideDocuments = (guide_id, documents) => {
    return new Promise((resolve, reject) => {
        if (!documents || documents.length === 0) return resolve(true);

        const sql = `
            INSERT INTO Guide_Documents 
            (guide_id, doc_type, document_number, expiry_date, storage_path, verification_status, notes)
            VALUES ?
        `;

        const values = documents.map(doc => [
            guide_id,
            doc.doc_type,
            doc.document_number || null,
            doc.expiry_date || null,
            doc.storage_path,
            doc.verification_status || "Pending",
            doc.notes || null
        ]);

        pool.query(sql, [values], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// ---------------- GET GUIDE WITH DOCUMENTS ----------------
const getGuideById = (guide_id) => {
    return new Promise((resolve, reject) => {
        const sqlGuide = `SELECT * FROM Guides WHERE guide_id = ?`;
        const sqlDocs = `SELECT * FROM Guide_Documents WHERE guide_id = ?`;

        pool.query(sqlGuide, [guide_id], (err, guideResult) => {
            if (err) return reject(err);
            if (guideResult.length === 0) return resolve(null);

            pool.query(sqlDocs, [guide_id], (err, docsResult) => {
                if (err) return reject(err);

                resolve({
                    ...guideResult[0],
                    documents: docsResult
                });
            });
        });
    });
};

module.exports = {
    createGuide,
    addGuideDocuments,
    getGuideById,
    getAllGuides
};