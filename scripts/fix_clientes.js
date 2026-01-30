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
    console.log('Conectado ao MySQL, verificando clientes...');

    const [rows] = await connection.execute('SELECT id, nome FROM clientes');
    const candidates = rows.filter(r => /[\uFFFD]|Ã|�/.test(r.nome));

    if (candidates.length === 0) {
      console.log('Nenhum nome com padrão suspeito encontrado. Saindo.');
      connection.release();
      await pool.end();
      process.exit(0);
    }

    console.log('Possíveis nomes corrompidos:', candidates);

    for (const c of candidates) {
      // Tentativa de correção: interpretar string atual como latin1 e converter para utf8
      const fixed = Buffer.from(c.nome, 'latin1').toString('utf8');

      // Se a correção produz menos caracteres de substituição/seq Ã, aplicamos
      const originalScore = (c.nome.match(/(Ã|�|\uFFFD)/g) || []).length;
      const fixedScore = (fixed.match(/(Ã|�|\uFFFD)/g) || []).length;

      if (fixedScore < originalScore || /[\u00C0-\u017F]/.test(fixed)) {
        try {
          const [res] = await connection.execute('UPDATE clientes SET nome = ? WHERE id = ?', [fixed, c.id]);
          console.log(`Atualizado id=${c.id}: "${c.nome}" -> "${fixed}" (affected=${res.affectedRows})`);
        } catch (err) {
          console.log(`Falha ao atualizar id=${c.id}:`, err.message);
        }
      } else {
        console.log(`Ignorado id=${c.id}, tentativa de correção não melhorou: "${c.nome}" -> "${fixed}"`);
      }
    }

    const [after] = await connection.execute('SELECT id, nome FROM clientes');
    console.log('Clientes após correção:');
    console.table(after);

    connection.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Erro:', err);
    process.exit(1);
  }
})();
