const { sql, getPool } = require('../../config/database');

async function getInfoAccount(user_id,role){
    const pool = await getPool();
    if (role === 'customer'){
        const result = await pool.request()
            .input ('user_id', sql.Int, user_id)
            .query('
                SELECT cus_id, fullname, email, address, phone, cus_status, password
                FROM Customer 
                WHERE user_id = @user_id;
            ');
        if (result.recordset.length > 0){
            return result.recordset[0];
        }
    }
    else{
        const result = await pool.request()
        .input ('user_id', sql.Int, user_id)
        .query('
            SELECT emp_id, fullname, email, address, phone, emp_status, password
        ')
    }
}