const $ = s => document.querySelector(s);
const esc = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtData = d => d.split('-').reverse().join('/');
const idade = n => Math.floor((Date.now() - new Date(n)) / 31557600000);

function cpfValido(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += cpf[i] * (t + 1 - i);
    if ((soma * 10 % 11) % 10 != cpf[t]) return false;
  }
  return true;
}
const mascaraCpf = v => v.replace(/\D/g,'').slice(0,11)
  .replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');

// ---------- Navegação ----------
document.querySelectorAll('.menu button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.menu button, .aba').forEach(e => e.classList.remove('ativo', 'ativa'));
  b.classList.add('ativo');
  $('#' + b.dataset.tab).classList.add('ativa');
});

// ---------- Pacientes ----------
function renderPacientes() {
  const termo = $('#busca').value.toLowerCase();
  const lista = DB.ler('pacientes').filter(p => p.nome.toLowerCase().includes(termo) || p.cpf.includes(termo));
  $('#listaPacientes').innerHTML = lista.length ? lista.map(p => `
    <tr><td>${esc(p.nome)}</td><td>${esc(p.cpf)}</td><td>${idade(p.nasc)} anos</td><td>${esc(p.tel)}</td>
    <td><button class="del" onclick="removerPaciente('${p.id}')">Excluir</button></td></tr>`).join('')
    : '<tr><td colspan="5" class="vazio">Nenhum paciente. Cadastre o primeiro acima.</td></tr>';
  const opcoes = DB.ler('pacientes').map(p => `<option value="${p.id}">${esc(p.nome)}</option>`).join('');
  const vazio = '<option value="" disabled selected>Selecione o paciente</option>';
  ['#cPaciente', '#rPaciente'].forEach(s => { const v = $(s).value; $(s).innerHTML = vazio + opcoes; if (v) $(s).value = v; });
}
$('#pCpf').oninput = e => e.target.value = mascaraCpf(e.target.value);
$('#busca').oninput = renderPacientes;
$('#formPaciente').onsubmit = e => {
  e.preventDefault();
  if (!cpfValido($('#pCpf').value)) return alert('CPF inválido. Confira os números.');
  const pacientes = DB.ler('pacientes');
  if (pacientes.some(p => p.cpf === $('#pCpf').value)) return alert('Este CPF já está cadastrado.');
  pacientes.push({ id: DB.id(), nome: $('#pNome').value.trim(), cpf: $('#pCpf').value,
                   nasc: $('#pNasc').value, tel: $('#pTel').value });
  DB.salvar('pacientes', pacientes);
  e.target.reset(); renderPacientes();
};
function removerPaciente(id) {
  if (!confirm('Excluir paciente e todo o histórico dele?')) return;
  DB.salvar('pacientes', DB.ler('pacientes').filter(p => p.id !== id));
  DB.salvar('consultas', DB.ler('consultas').filter(c => c.pacienteId !== id));
  DB.salvar('prontuarios', DB.ler('prontuarios').filter(r => r.pacienteId !== id));
  renderTudo();
}

// ---------- Agenda ----------
function renderConsultas() {
  const dia = $('#filtroData').value;
  const nome = id => (DB.ler('pacientes').find(p => p.id === id) || { nome: '(removido)' }).nome;
  const lista = DB.ler('consultas').filter(c => !dia || c.data === dia)
    .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  $('#listaConsultas').innerHTML = lista.length ? lista.map(c => `
    <tr><td>${fmtData(c.data)} ${c.hora}</td><td>${esc(nome(c.pacienteId))}</td><td>${esc(c.motivo)}</td>
    <td><span class="status ${c.status}">${c.status}</span></td>
    <td>${c.status === 'agendada' ? `<button onclick="mudarStatus('${c.id}','realizada')">Concluir</button>
    <button onclick="mudarStatus('${c.id}','cancelada')">Cancelar</button>` : ''}</td></tr>`).join('')
    : '<tr><td colspan="5" class="vazio">Nenhuma consulta neste filtro.</td></tr>';
}
$('#filtroData').onchange = renderConsultas;
$('#formConsulta').onsubmit = e => {
  e.preventDefault();
  const consultas = DB.ler('consultas');
  const [data, hora] = [$('#cData').value, $('#cHora').value];
  if (consultas.some(c => c.data === data && c.hora === hora && c.status === 'agendada'))
    return alert('Já existe consulta agendada neste horário.');
  consultas.push({ id: DB.id(), pacienteId: $('#cPaciente').value, data, hora,
                   motivo: $('#cMotivo').value.trim(), status: 'agendada' });
  DB.salvar('consultas', consultas);
  e.target.reset(); renderConsultas();
};
function mudarStatus(id, status) {
  const c = DB.ler('consultas'); c.find(x => x.id === id).status = status;
  DB.salvar('consultas', c); renderConsultas();
}

// ---------- Prontuário ----------
function renderHistorico() {
  const id = $('#rPaciente').value;
  const regs = DB.ler('prontuarios').filter(r => r.pacienteId === id).reverse();
  $('#historico').innerHTML = !id ? '<p class="vazio">Selecione um paciente para ver o histórico.</p>'
    : regs.length ? regs.map(r => `<div class="registro"><small>${new Date(r.criado).toLocaleString('pt-BR')}</small>
      <p>${esc(r.texto)}</p></div>`).join('')
    : '<p class="vazio">Este paciente ainda não tem registros.</p>';
}
$('#rPaciente').onchange = renderHistorico;
$('#formProntuario').onsubmit = e => {
  e.preventDefault();
  const regs = DB.ler('prontuarios');
  regs.push({ id: DB.id(), pacienteId: $('#rPaciente').value, texto: $('#rTexto').value.trim(), criado: new Date().toISOString() });
  DB.salvar('prontuarios', regs);
  $('#rTexto').value = ''; renderHistorico();
};

function renderTudo() { renderPacientes(); renderConsultas(); renderHistorico(); }
$('#hoje').textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
renderTudo();
