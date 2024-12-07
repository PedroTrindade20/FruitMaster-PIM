// Exibir produtos cadastrados
const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

const tabela = document.getElementById("produtos");
produtos.forEach((produto) => {
  const row = tabela.insertRow();
  row.insertCell(0).innerText = produto.id;
  row.insertCell(1).innerText = produto.nome;
  row.insertCell(2).innerText = produto.quantidade;
  row.insertCell(3).innerText = produto.local;
});
