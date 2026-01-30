const mysql = require('mysql2/promise');

(async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'senha123',
      database: process.env.DB_DATABASE || 'salao',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      charset: 'utf8mb4'
    });

    const connection = await pool.getConnection();
    console.log('Conectado ao MySQL, atualizando cliente id=1 para "João Santos"...');

    const [res] = await connection.execute('UPDATE clientes SET nome = ? WHERE id = ?', ['João Santos', 1]);
    console.log('AffectedRows:', res.affectedRows);

    const [rows] = await connection.execute('SELECT id, nome FROM clientes');
    console.log('Clientes atuais:');
    console.table(rows);

    connection.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Erro:', err);
    process.exit(1);
  }
})();
