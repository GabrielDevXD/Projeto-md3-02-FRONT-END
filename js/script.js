const baseURL = 'http://localhost:3000/roupas';

async function findAllroupas() {
  const response = await fetch(`${baseURL}/find-roupas`);

  const roupas = await response.json();

  roupas.forEach((roupas) => {
    console.log(roupas._id)
    document.getElementById('roupas-List').insertAdjacentHTML(
      'beforeend',
      ` <div class="col-4">
      <div class="roupasListaItem" id="roupasListaItem_'${roupas._id}'"></div>
      <img class="roupasListaItem__foto" src=${roupas.foto}
      <div class="roupasListaItem__nome">
      <h4>${roupas.nome}</h4>
      <div class="roupasListaItem__preco">R$ ${roupas.preco}</div>
      <button class ="editar btn"onclick="abrirModal('${roupas._id}')">Editar</button>
      <button class ="apagar btn"onclick="abrirModalDelete('${roupas._id}')">Apagar</button>
      </div>
      </div>
      <p></p>
  </div>`,
    );
  });
}

async function findByIdroupas() {
  const id = document.querySelector("#search-input").value;

  if (id == "") {
    localStorage.setItem("message", "Digite um ID para pesquisar!");
    localStorage.setItem("type", "danger");
    return;
  }
  const response = await fetch(`${baseURL}/one-roupas/${id}`);
  const roupas = await response.json();
  if (roupas.message != undefined) {
    localStorage.setItem("message", roupas.message);
    localStorage.setItem("type", "danger");

    return;
  }
  document.querySelector(".list-all").style.display = "block";
  document.querySelector(".roupasList").style.display = "none";
  const roupaEscolhidaDiv = document.querySelector("#Escolha-roupas")

  roupaEscolhidaDiv.innerHTML = `<div class="col-4">
  <div class="roupasListaItem" id="roupasListaItem_'${roupas._id}'">
  <img class="roupasListaItem__foto" src=${roupas.foto}
  <h4>${roupas.nome}</h4>
  <h4>${roupas.descricao}</h4>
  <div class="roupasListaItem__preco">R$ ${roupas.preco}</div>
  </div>
  <p></p>
</div>`;
}
findAllroupas();

async function abrirModal(id = "") {
  console.log(id)
  if (id != "") {
    document.querySelector('#title-header-modal').innerHTML =
      'Atualizar uma roupas';
    document.querySelector('.test').innerHTML = 'Atualizar';

    const response = await fetch(`${baseURL}/find-roupas/${id}`);
    const roupas = await response.json();

    document.querySelector('#nome').value = roupas.nome;
    document.querySelector('#preco').value = roupas.preco;
    document.querySelector('#descricao').value = roupas.descricao;
    document.querySelector('#foto').value = roupas.foto;
    document.querySelector('#id').value = roupas._id;
  } else {
    document.querySelector('#title-header-modal').innerHTML =
      'Cadastrar uma roupas';
    document.querySelector('.test').innerHTML = 'Cadastrar';
  }
  document.querySelector('.modal-overlay').style.display = 'flex';
}

function fecharModalCadastro() {
  document.querySelector('.modal-overlay').style.display = 'none';

  document.querySelector('#nome').value = '';
  document.querySelector('#preco').value = 0;
  document.querySelector('#descricao').value = '';
  document.querySelector('#foto').value = '';
  document.querySelector('#id').value = '';
}

// updatazada
async function addroupas() {
  const id = document.querySelector('#id').value;
  const nome = document.querySelector('#nome').value;
  const preco = document.querySelector('#preco').value;
  const descricao = document.querySelector('#descricao').value;
  const foto = document.querySelector('#foto').value;

  const roupas = {
    id,
    nome,
    preco,
    descricao,
    foto,
  };

  const modo = id != "";

  const endpoint = baseURL + (modo ? `/update/${id}` : `/create`); 

  const response = await fetch(endpoint, {
    method: modo ? 'put' : 'post',
    headers: {
      'content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(roupas),
  });

  const newroupas = await response.json();

  const html = `
  <div class="col-4">
      <div class="roupasListaItem" id="roupasListaItem_${roupas._id}">
      <img class="roupasListaItem__foto" src=${roupas.foto}
      <h4>${roupas.nome}</h4>
      <h4>${roupas.descricao}</h4>
      <div class="roupasListaItem__preco">R$ ${roupas.preco}</div>
      </div>
      <p></p>
  </div>
  `;
document.location.reload(true)
  fecharModalCadastro();
}


function abrirModalDelete(id) {
  document.querySelector('#overlay-delete').style.display = 'flex';

  const btnDelete = document.querySelector('#teste');

  btnDelete.addEventListener('click', function () {
    deleteroupas(id);
  });
}

function fecharModalDelete() {
  document.querySelector('#overlay-delete').style.display = 'none';
}

async function deleteroupas(id) {
  const response = await fetch(`${baseURL}/delete/${id}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });

  const result = await response.json();


  document.querySelector('#roupas-List').innerHTML = '';

  fecharModalDelete();
  findAllroupas();
}