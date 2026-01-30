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
    console.log('Conectado ao MySQL, atualizando registros...');

    const updates = [
      { id: 3, nome: 'Hidratação', valor: 60.00 },
      { id: 5, nome: 'Coloração', valor: 150.00 }
    ];

    for (const u of updates) {
      const [res] = await connection.execute('UPDATE servicos SET nome = ?, valor = ? WHERE id = ?', [u.nome, u.valor, u.id]);
      console.log(`Atualizado id=${u.id}: affectedRows=${res.affectedRows}`);
    }

    const [rows] = await connection.execute('SELECT id, nome, valor FROM servicos');
    console.log('Serviços atuais:');
    console.table(rows);

    connection.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Erro:', err);
    process.exit(1);
  }
})();
