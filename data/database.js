import mysql from 'mysql2';
import dotenv from 'dotenv';

// import bcrypt from 'bcrypt';


dotenv.config({path: './config.env'});

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

}).promise();
// ==============================================================================================================================
// contact
// ==============================================================================================================================
export const getAllContacts = async () => {
   const result = await pool.query('SELECT * FROM contact_information');

   console.log(result)
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





// ==========================================================================================================================
//  USERS
// ============================================================================================================================
export const getAllRoles = async () => {
    const result = await pool.query('SELECT * FROM position');
    return result[0];   
}



export const createUser = async (oUser) => {
    const result = await pool.query(
        'INSERT INTO users (first_name, last_name, location, position, password) VALUES (?, ?, ?, ?, ?)',
        [oUser.first_name, oUser.last_name, oUser.location, oUser.position, oUser.password]
    );
    return result[0];
}


export const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = ?',
    [id]
    );
    return result[0];
}


export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result[0];
}


// ============================================================================================================
// data to render on meals page
// ===========================================================================================================
export const getAllMeals = async (limit, offset) => {
    const result = await pool.query('SELECT * FROM meals_data LIMIT ? OFFSET ?', [limit, offset]);
    return result[0];
};

// export const getAllOrders = async (limit, offset) => {
//     const result = await pool.query('SELECT * FROM orders LIMIT 6 OFFSET 10', [limit, offset]);
//     return result[0];
//   };

  
 export  const getTotalMealsCount = async () => {
    const result =  await pool.query('SELECT COUNT(*) AS itemCount FROM meals_data');
    return result[0].itemCount;
 };
  
  

export const addMeal = async (newEntry) => {
    try {
        const queryText = 'INSERT INTO meals_data (meal_name, image) VALUES (?, ?)';
        const values = [newEntry.meal_name, newEntry.image]

        const result = await pool.query(queryText, values);
        return result[0];
    } catch (error) {
        throw error;
    }
};

export const deleteSingleMeal = async (id) => {
    const result = await pool.query('DELETE FROM meals_data WHERE id =?',
    [id]
    );
    return result[0];
}



export const getAllMeals2 = async (limit, offset) => {
    const result = await pool.query('SELECT * FROM meals_data ');
    return result[0];
};



// ========================================================================================================
// ORDERS
// =======================================================================================================

export const getAllOrders = async () => {
    const result = await pool.query('SELECT * FROM orders');
    return result[0] ;
}



export const newOrder = async (oOrder) => {
    try {
        console.log('Inserting new order:', oOrder);
        const query = 'INSERT INTO orders (meal_ordered, stud_fn, stud_ln, location, email) VALUES (?, ?, ?, ?, ?)';
        const values = [oOrder.meal_ordered, oOrder.stud_fn, oOrder.stud_ln, oOrder.location, oOrder.email];
        console.log('Query:', query);
        console.log('Values:', values); 
        const result = await pool.query(query, values);
        console.log('Insertion result:', result); 
        return result[0];
    } catch (error) {
        console.error('Error inserting new order:', error); 
        throw error;
    }
};


export const getSingleOrder = async (id) => {
    const result = await pool.query('SELECT * FROM orders WHERE id =?',
    [id]
    );
    return result[0];
};


export const deleteSingleOrder = async (id) => {
    const result = await pool.query('DELETE FROM orders WHERE id =?',
    [id]
    );
    return result[0];
}








