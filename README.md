# Consultório Médico

Sistema simples de gestão de consultório feito com **HTML, CSS e JavaScript puro** (sem dependências).

## Funcionalidades
- **Pacientes:** cadastro com validação de CPF, busca por nome/CPF e exclusão.
- **Agenda:** agendamento, bloqueio de horário duplicado, filtro por dia e status (agendada, realizada, cancelada).
- **Prontuário:** registros de atendimento por paciente, em ordem do mais recente.

## Como usar
Abra o arquivo `index.html` no navegador. Não precisa de servidor.

## Estrutura
```
consultorio-medico/
├── index.html
├── css/style.css
└── js/
    ├── storage.js   # acesso ao localStorage
    └── app.js       # regras e interface
```

## Observações
- Os dados ficam no `localStorage` do navegador. Não use com dados reais de pacientes sem um back-end seguro (LGPD).
- Próximos passos: back-end (Node.js + banco de dados), login de médicos, exportar prontuário em PDF.

## Licença
MIT

## Revisão por pares: Aula 11 (DOM e Armazenamento Local) -- Yan Braga de Andrade

Oi! Revisei o projeto do consultório, li o código e testei no navegador.

**1. Script protegido (DOMContentLoaded ou defer):**
Atende Parcialmente. O script está no fim do body, o que evita 
o problema na prática, mas o critério pede DOMContentLoaded ou defer. 
Vale adicionar defer na tag script.

**2. Persistência funciona de verdade:**
Atende Plenamente. O localStorage (storage.js)
mantém os dados ao recarregar a página.

**3. Event delegation em listas:** Não Atende. Não encontrei nenhum
addEventListener nos arquivos JS. Sugestão: um único ouvinte no elemento
pai da lista, identificando o item clicado com event.target.

**4. textContent para dado do usuário:**
Atende Parcialmente. Os dados do usuário passam por innerHTML (app.js, 
linhas 30, 64 e 92), mas o texto é exibido sem ser interpretado como HTML. 
Ainda assim, o critério pede textContent.

**5. PR na branch correta:** Não Atende. Não encontrei Pull Request nem a
branch feature/dom-interatividade. Os commits são "Add files via upload".

