document.addEventListener("DOMContentLoaded", () => {
  let db;
  const request = indexedDB.open("usuariosDB", 1);

  request.onerror = function (event) {
    console.error("Erro ao abrir o IndexedDB", event);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Banco de dados aberto com sucesso");
    fetchUsers();
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("usuarios", {
      keyPath: "id",
      autoIncrement: true,
    });
    objectStore.createIndex("nome", "nome", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });
  };

  document
    .getElementById("userForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const nome = document.getElementById("userName").value;
      const email = document.getElementById("userEmail").value;

      const transaction = db.transaction(["usuarios"], "readwrite");
      const objectStore = transaction.objectStore("usuarios");
      const request = objectStore.add({ nome: nome, email: email });

      request.onsuccess = function (event) {
        console.log("Usuário cadastrado com sucesso");
        displayWelcomeMessage(nome); // A mensagem de boas-vindas ainda será exibida
        fetchUsers();
      };

      request.onerror = function (event) {
        console.error("Erro ao cadastrar o usuário", event);
      };

      document.getElementById("userForm").reset();
    });

  function fetchUsers() {
    const transaction = db.transaction(["usuarios"], "readonly");
    const objectStore = transaction.objectStore("usuarios");
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
      const users = event.target.result;
      const userGrid = document.querySelector("#userGrid");
      userGrid.innerHTML = "";

      users.forEach((user) => {
        const userCard = document.createElement("div");
        userCard.className = "user-card";
        userCard.innerHTML = `
          <h3>${user.nome}</h3>
          <p>${user.email}</p>
          <button onclick="deleteUser(${user.id})">Excluir</button>
        `;
        userGrid.appendChild(userCard);
      });
    };
  }

  window.deleteUser = function (userId) {
    const transaction = db.transaction(["usuarios"], "readwrite");
    const objectStore = transaction.objectStore("usuarios");
    const request = objectStore.delete(userId);

    request.onsuccess = function () {
      console.log("Usuário excluído com sucesso");
      fetchUsers(); // Atualiza a lista de usuários
    };

    request.onerror = function (event) {
      console.error("Erro ao excluir o usuário", event);
    };
  };

  function displayWelcomeMessage(username) {
    const welcomeMessage = document.getElementById("welcomeMessage");
  }
});
