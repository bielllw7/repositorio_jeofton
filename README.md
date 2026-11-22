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
