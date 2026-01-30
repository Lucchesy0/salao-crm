const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const app = express();

app.use(express.json());

// Servir arquivos estáticos do build (dist) quando em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
} else {
  app.use(express.static(path.join(__dirname, 'public')));
}

// Helper para gerar códigos curtos (alfa-numéricos)
function generateProcedureCode(len = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // exclude confusing chars
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// Usuários de teste - em produção, seria no banco de dados
const USERS = {
  'admin': { password: '123', role: 'admin', nome: 'Administrador' },
  'cabeleireira': { password: '123', role: 'cabeleireira', nome: 'Cabeleireira' },
  'auxiliar': { password: '123', role: 'auxiliar', nome: 'Auxiliar' },
  'cliente': { password: '123', role: 'cliente', nome: 'Cliente' }
};

// ===== AUTENTICAÇÃO =====
app.post('/auth/login', (req, res) => {
  const { usuario, senha } = req.body;
  
  if (!usuario || !senha) {
    return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
  }
  
  const user = USERS[usuario];
  
  if (!user || user.password !== senha) {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }
  
  res.json({
    success: true,
    user: {
      usuario: usuario,
      nome: user.nome,
      role: user.role,
      loginTime: new Date().toISOString()
    }
  });
});

app.get('/auth/users', (req, res) => {
  const users = Object.keys(USERS).map(key => ({
    usuario: key,
    senha: '123',
    nome: USERS[key].nome,
    role: USERS[key].role
  }));
  res.json(users);
});

// Middleware de permissão: checa header 'x-user-role' ou 'x-user'
function getRoleFromReq(req) {
  try {
    const headerRole = (req.headers['x-user-role'] || req.headers['x-user']) || '';
    if (headerRole) return headerRole.toString();
    if (req.body && req.body.user && req.body.user.role) return req.body.user.role;
    return '';
  } catch (e) {
    return '';
  }
}

function requireAdmin(req, res, next) {
  const role = getRoleFromReq(req);
  if (role === 'admin') return next();
  return res.status(403).json({ erro: 'Permissão negada: administração necessária' });
}

// BANCO MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "senha123",
  database: process.env.DB_DATABASE || "salao",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci'
});

// Criar tabelas
let tabelasCriadas = false;

const criarTabelas = async (tentativa = 1) => {
  if (tabelasCriadas) {
    console.log("✅ Tabelas já foram criadas");
    return;
  }
  
  try {
    console.log(`[Tentativa ${tentativa}] Conectando ao MySQL...`);
    const connection = await pool.getConnection();
    console.log("✅ Conectado ao MySQL");
    
    const queries = [
      `CREATE TABLE IF NOT EXISTS auxiliares (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS cabeleireiras (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        nome VARCHAR(255) NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS servicos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        valor DECIMAL(10, 2) NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS horarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hora_inicio TIME NOT NULL,
        hora_fim TIME NOT NULL,
        dias_semana VARCHAR(20),
        ativo BOOLEAN DEFAULT TRUE
      )`,
      `CREATE TABLE IF NOT EXISTS registros (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        horario_agendamento DATETIME,
        auxiliar_id INT,
        servico_id INT,
        cliente_id INT,
        cabeleireira_id INT,
        observacoes TEXT,
        status VARCHAR(50) DEFAULT 'agendado'
      )`
    ];

    for (const query of queries) {
      await connection.execute(query);
    }

    // Garantir que tabelas e collation estão em UTF8MB4
    try {
      const tables = ['auxiliares','cabeleireiras','clientes','servicos','registros','horarios'];
      for (const t of tables) {
        try {
          await connection.execute(`ALTER TABLE ${t} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        } catch (innerErr) {
          console.log(`Aviso: não foi possível converter tabela ${t}:`, innerErr.message);
        }
      }
    } catch (convErr) {
      console.log('Erro ao tentar converter charsets das tabelas:', convErr.message);
    }

    // Garantir colunas necessárias
    const ensureColumnExists = async (table, column, definition) => {
      try {
        const [rows] = await connection.execute(
          `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
          [table, column]
        );
        if (rows && rows[0] && rows[0].cnt === 0) {
          await connection.execute(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
          console.log(`Coluna ${column} adicionada em ${table}`);
        }
      } catch (e) {
        console.log(`Aviso: não foi possível garantir coluna ${column} em ${table}:`, e.message);
      }
    };

    try {
      await ensureColumnExists('registros', 'codigo_procedimento', "codigo_procedimento VARCHAR(50) UNIQUE");
      await ensureColumnExists('registros', 'horario_agendamento', "horario_agendamento DATETIME");
      await ensureColumnExists('registros', 'auxiliar_id', "auxiliar_id INT");
      await ensureColumnExists('registros', 'servico_id', "servico_id INT");
      await ensureColumnExists('registros', 'cliente_id', "cliente_id INT");
      await ensureColumnExists('registros', 'cabeleireira_id', "cabeleireira_id INT");
      await ensureColumnExists('registros', 'observacoes', "observacoes TEXT");
      await ensureColumnExists('registros', 'status', "status VARCHAR(50) DEFAULT 'agendado'");
    } catch (colErr) {
      console.log('Aviso: erro ao garantir colunas em registros:', colErr.message);
    }

    connection.release();
    tabelasCriadas = true;
    console.log("✅ Todas as tabelas criadas/verificadas com sucesso");
    return true;
  } catch (err) {
    console.error(`❌ [Tentativa ${tentativa}] Erro ao criar tabelas:`, err.message);
    if (tentativa < 10) {
      console.log(`⏳ Tentando novamente em 2 segundos... (tentativa ${tentativa + 1}/10)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return criarTabelas(tentativa + 1);
    }
    throw err;
  }
};

app.get("/", (req, res) => {
  res.json({ mensagem: "🚀 Salão funcionando!" });
});

// ===== AUXILIARES =====
app.get('/auxiliares', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM auxiliares');
    connection.release();
    res.json(rows || []);
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/auxiliares', requireAdmin, async (req, res) => {
  console.log("POST /auxiliares recebido:", req.body);
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório" });
  }
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('INSERT INTO auxiliares (nome) VALUES (?)', [nome]);
    connection.release();
    console.log("Auxiliar cadastrado:", { id: result.insertId, nome });
    res.json({ id: result.insertId, nome });
  } catch (err) {
    console.error("Erro ao inserir:", err);
    res.status(500).json({ erro: err.message });
  }
});

// DELETAR AUXILIAR (admin apenas)
app.delete('/auxiliares/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM auxiliares WHERE id = ?', [id]);
    connection.release();
    console.log(`Auxiliar ${id} deletado`);
    res.json({ success: true, id: Number(id), message: 'Auxiliar deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar auxiliar:', err);
    res.status(500).json({ erro: err.message });
  }
});

// ===== CABELEIREIRAS =====
app.get('/cabeleireiras', async (req, res) => {
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM cabeleireiras');
    connection.release();
    res.json(rows || []);
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/cabeleireiras', requireAdmin, async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório" });
  }
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [result] = await connection.execute('INSERT INTO cabeleireiras (nome) VALUES (?)', [nome]);
    connection.release();
    res.json({ id: result.insertId, nome });
  } catch (err) {
    console.error("Erro ao inserir:", err);
    res.status(500).json({ erro: err.message });
  }
});

// DELETAR CABELEIREIRA (admin apenas)
app.delete('/cabeleireiras/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM cabeleireiras WHERE id = ?', [id]);
    connection.release();
    console.log(`Cabeleireira ${id} deletada`);
    res.json({ success: true, id: Number(id), message: 'Cabeleireira deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar cabeleireira:', err);
    res.status(500).json({ erro: err.message });
  }
});

// ===== CLIENTES =====
app.get('/clientes', async (req, res) => {
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM clientes');
    connection.release();
    res.json(rows || []);
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/clientes', requireAdmin, async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório" });
  }
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [result] = await connection.execute('INSERT INTO clientes (nome) VALUES (?)', [nome]);
    connection.release();
    res.json({ id: result.insertId, nome });
  } catch (err) {
    console.error("Erro ao inserir:", err);
    res.status(500).json({ erro: err.message });
  }
});

// DELETAR CLIENTE (admin apenas)
app.delete('/clientes/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM clientes WHERE id = ?', [id]);
    connection.release();
    console.log(`Cliente ${id} deletado`);
    res.json({ success: true, id: Number(id), message: 'Cliente deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar cliente:', err);
    res.status(500).json({ erro: err.message });
  }
});

// ===== SERVIÇOS =====
app.get('/servicos', async (req, res) => {
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM servicos');
    connection.release();
    res.json(rows || []);
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/servicos', requireAdmin, async (req, res) => {
  const { nome, valor } = req.body;
  if (!nome || !valor) {
    return res.status(400).json({ erro: "Nome e valor são obrigatórios" });
  }
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [result] = await connection.execute('INSERT INTO servicos (nome, valor) VALUES (?, ?)', [nome, parseFloat(valor)]);
    connection.release();
    res.json({ id: result.insertId, nome, valor: parseFloat(valor) });
  } catch (err) {
    console.error("Erro ao inserir:", err);
    res.status(500).json({ erro: err.message });
  }
});

app.put('/servicos/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome, valor } = req.body;
  if (!nome || !valor) {
    return res.status(400).json({ erro: "Nome e valor são obrigatórios" });
  }
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [result] = await connection.execute('UPDATE servicos SET nome = ?, valor = ? WHERE id = ?', [nome, parseFloat(valor), id]);
    connection.release();
    res.json({ success: true, id: Number(id), nome, valor: parseFloat(valor) });
  } catch (err) {
    console.error('Erro ao atualizar serviço:', err);
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/servicos/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM servicos WHERE id = ?', [id]);
    connection.release();
    console.log(`Serviço ${id} deletado`);
    res.json({ success: true, id: Number(id), message: 'Serviço deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar serviço:', err);
    res.status(500).json({ erro: err.message });
  }
});

// ===== REGISTROS (AGENDAMENTOS) =====
app.get('/registros', async (req, res) => {
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM registros');
    connection.release();
    res.json(rows || []);
  } catch (err) {
    console.error('Erro ao listar registros:', err);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/registros', async (req, res) => {
  const { horario_agendamento, auxiliar_id, servico_id, cliente_id, cabeleireira_id, observacoes, status } = req.body;
  if (!horario_agendamento || !cliente_id) {
    return res.status(400).json({ erro: 'Horário e cliente são obrigatórios' });
  }
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    let codigo = generateProcedureCode(8);
    let attempts = 0;
    while (attempts < 5) {
      try {
        const [result] = await connection.execute(
          'INSERT INTO registros (horario_agendamento, auxiliar_id, servico_id, cliente_id, cabeleireira_id, observacoes, status, codigo_procedimento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [horario_agendamento, auxiliar_id || null, servico_id || null, cliente_id, cabeleireira_id || null, observacoes || '', status || 'agendado', codigo]
        );
        connection.release();
        return res.json({ id: result.insertId, horario_agendamento, cliente_id, status: status || 'agendado', codigo_procedimento: codigo });
      } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') {
          codigo = generateProcedureCode(8);
          attempts++;
          continue;
        }
        connection.release();
        throw e;
      }
    }
    connection.release();
    return res.status(500).json({ erro: 'Não foi possível gerar código único, tente novamente' });
  } catch (err) {
    console.error('Erro ao inserir registro:', err);
    res.status(500).json({ erro: err.message });
  }
});

app.get('/registros/code/:code', async (req, res) => {
  const { code } = req.params;
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM registros WHERE codigo_procedimento = ? LIMIT 1', [code]);
    connection.release();
    if (!rows || rows.length === 0) return res.status(404).json({ erro: 'Código não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar por código:', err);
    res.status(500).json({ erro: err.message });
  }
});

app.put('/registros/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { horario_agendamento, auxiliar_id, servico_id, cliente_id, cabeleireira_id, observacoes, status } = req.body;
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE registros SET horario_agendamento = ?, auxiliar_id = ?, servico_id = ?, cliente_id = ?, cabeleireira_id = ?, observacoes = ?, status = ? WHERE id = ?',
      [horario_agendamento, auxiliar_id || null, servico_id || null, cliente_id, cabeleireira_id || null, observacoes || '', status || 'agendado', id]
    );
    connection.release();
    res.json({ success: true, id: Number(id), affectedRows: result.affectedRows });
  } catch (err) {
    console.error('Erro ao atualizar registro:', err);
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/registros/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM registros WHERE id = ?', [id]);
    connection.release();
    res.json({ success: true, id: Number(id) });
  } catch (err) {
    console.error('Erro ao deletar registro:', err);
    res.status(500).json({ erro: err.message });
  }
});

// ===== HORÁRIOS =====
app.get('/horarios', async (req, res) => {
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM horarios');
    connection.release();
    res.json(rows || []);
  } catch (err) {
    console.error('Erro ao listar horários:', err);
    res.status(500).json({ erro: err.message });
  }
});

app.post('/horarios', requireAdmin, async (req, res) => {
  const { hora_inicio, hora_fim, dias_semana, ativo } = req.body;
  if (!hora_inicio || !hora_fim) {
    return res.status(400).json({ erro: 'Horas inicial e final são obrigatórias' });
  }
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO horarios (hora_inicio, hora_fim, dias_semana, ativo) VALUES (?, ?, ?, ?)',
      [hora_inicio, hora_fim, dias_semana || '', ativo !== false]
    );
    connection.release();
    res.json({ id: result.insertId, hora_inicio, hora_fim, dias_semana, ativo });
  } catch (err) {
    console.error('Erro ao inserir horário:', err);
    res.status(500).json({ erro: err.message });
  }
});

app.put('/horarios/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { hora_inicio, hora_fim, dias_semana, ativo } = req.body;
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE horarios SET hora_inicio = ?, hora_fim = ?, dias_semana = ?, ativo = ? WHERE id = ?',
      [hora_inicio, hora_fim, dias_semana || '', ativo !== false, id]
    );
    connection.release();
    res.json({ success: true, id: Number(id), affectedRows: result.affectedRows });
  } catch (err) {
    console.error('Erro ao atualizar horário:', err);
    res.status(500).json({ erro: err.message });
  }
});

app.delete('/horarios/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM horarios WHERE id = ?', [id]);
    connection.release();
    res.json({ success: true, id: Number(id) });
  } catch (err) {
    console.error('Erro ao deletar horário:', err);
    res.status(500).json({ erro: err.message });
  }
});

// ===== DASHBOARD =====
app.get('/dashboard', async (req, res) => {
  try {
    await criarTabelas();
    const connection = await pool.getConnection();
    
    const [auxiliares] = await connection.execute('SELECT COUNT(*) as total FROM auxiliares');
    const [cabeleireiras] = await connection.execute('SELECT COUNT(*) as total FROM cabeleireiras');
    const [clientes] = await connection.execute('SELECT COUNT(*) as total FROM clientes');
    const [servicos] = await connection.execute('SELECT COUNT(*) as total FROM servicos');
    
    connection.release();
    
    res.json({
      auxiliares: auxiliares[0].total,
      cabeleireiras: cabeleireiras[0].total,
      clientes: clientes[0].total,
      servicos: servicos[0].total
    });
  } catch (err) {
    console.error("Erro ao buscar dashboard:", err);
    res.status(500).json({ erro: err.message });
  }
});

// Servir index.html para qualquer rota não encontrada (SPA routing)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

// Criar tabelas ao iniciar e depois escutar na porta
criarTabelas()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`🌐 Modo: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  });

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada:', reason);
});
