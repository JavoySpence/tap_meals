import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config({path: './config.env'});

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

}).promise();

export const getAllContacts = async ( )=> {
   const result = await pool.query('SELECT * FROM contact_information');
   return result[0];
}

export const newContact = async (oContact) => {
    const result = await pool.query('INSERT INTO contact_information (location, address) VALUES (?, ?)',
    [oContact.location, oContact.address]
    );

    return result[0];
}

export const deleteContact = async (id) => {
    const result = await pool.query('DELETE FROM contact_information WHERE id = ?',
    [id]
    );
    return result[0];
}

export const singleContact = async (id) => {
    const result = await pool.query('SELECT * FROM contact_information WHERE id =?',
    [id]
    );
    return result[0];
}

export const updateContact = async (oContact) => {
    try {
        const result = await pool.query('UPDATE contact_information SET location = ?, address = ? WHERE id = ?',
            [oContact.location, oContact.address, oContact.id]
        );
        return result[0];
    } catch (error) {
        throw error; 
    }
};
