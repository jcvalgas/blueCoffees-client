const baseURL = 'http:///localhost:3002/coffees';

async function findAllCoffees() {
  const response = await fetch(`${baseURL}/find-coffees`);

  const coffees = await response.json();
  coffees.forEach(function (coffee) {
    document.querySelector('#CoffeeList').insertAdjacentHTML(
      'beforeend',
      `
      <div class="CoffeeListItem" id="CoffeeListItem_${coffee._id}">
        <div>
          <div class="CoffeeListItem__sabor">${coffee.sabor}</div>
          <div class="CoffeeListItem__preco">R$${coffee.preco}</div>
          <div class="CoffeeListItem__descricao">
            ${coffee.descricao}
          </div>
          <div class="Acoes">
            <button class="Acoes__editar btn" onclick="abrirModal('${coffee._id}')">Editar</button> 
            <button class="Acoes__apagar btn" onclick="abrirModalDelete('${coffee._id}')">Apagar</button>
          </div>
        </div>
          <img class='CoffeeListItem__foto' src="${coffee.foto}" alt="${coffee.sabor}">    
      </div>
    `,
    );
  });
}

async function findByIdCoffees() {
  const id = document.getElementById('idCoffee').value;

  const response = await fetch(`${baseURL}/find-coffees/${id}`);

  const coffee = await response.json();

  const coffeeEscolhidoDiv = document.getElementById('CoffeeSelect');

  coffeeEscolhidoDiv.innerHTML = `<div class="CoffeeCardItem id="CoffeeListItem_${
    coffee.id
  }">
    <div>
      <div class="CoffeeCardItem__sabor">${coffee.sabor}</div>
      <div class="CoffeeCardItem__preco">R$ ${coffee.preco}</div>
      <div class="CoffeeCardItem__descricao">${coffee.descricao}</div>
      <div class="Acoes">
        <button class="Acoes__editar btn" onclick="abrirModal('${
          coffee._id
        }')">Editar</button> 
        <button class="Acoes__apagar btn" onclick="abrirModalDelete('${
          coffee._id
        }')">Apagar</button>
      </div>
    </div>
      <img class="PaletaCardItem__foto" src=${
        coffee.foto
      } alt=${`Paleta de ${coffee.sabor}`} />
    </div>`;
}

findAllCoffees();

async function abrirModal(id = '') {
  if (id != '') {
    document.querySelector('#title-header-modal').innerText =
      'Atualizar um Café';
    document.querySelector('#button-form-modal').innerText = 'Atualizar';

    const response = await fetch(`${baseURL}/find-coffees/${id}`);
    const coffee = await response.json();

    document.querySelector('#sabor').value = coffee.sabor;
    document.querySelector('#preco').value = coffee.preco;
    document.querySelector('#descricao').value = coffee.descricao;
    document.querySelector('#foto').value = coffee.foto;
    document.querySelector('#id').value = coffee._id;
  } else {
    document.querySelector('#title-header-modal').innerText = 'Cadastrar Café';
    document.querySelector('#button-form-modal').innerText = 'Cadastrar';
  }

  document.querySelector('.modal-overlay').style.display = 'flex';
}

function fecharModal() {
  document.querySelector('.modal-overlay').style.display = 'none';
  document.querySelector('#sabor').value = '';
  document.querySelector('#preco').value = 0;
  document.querySelector('#descricao').value = '';
  document.querySelector('#foto').value = '';
}

async function submitCoffee() {
  const id = document.getElementById('id').value;
  const sabor = document.querySelector('#sabor').value;
  const preco = document.querySelector('#preco').value;
  const descricao = document.querySelector('#descricao').value;
  const foto = document.querySelector('#foto').value;
  console.log(id);
  const coffee = {
    id,
    sabor,
    preco,
    descricao,
    foto,
  };

  const modoEdicaoAtivado = id != '';

  const endpoint = baseURL + (modoEdicaoAtivado ? `/update/${id}` : `/create`);

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? `put` : `post`,
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(coffee),
  });
  const newCoffee = await response.json();

  document.location.reload(true);

  // if(modoEdicaoAtivado) {
  //   document.querySelector(`#CoffeeListItem_${id}`).outerHTML = html;
  // } else {
  //   document.querySelector("#CoffeeList").insertAdjacentHTML("beforeend", html);
  // }

  fecharModal();
}

function abrirModalDelete(id) {
  document.querySelector('#overlay-delete').style.display = 'flex';

  const btnSim = document.querySelector('.btn_delete_yes');

  btnSim.addEventListener('click', function () {
    deleteCoffee(id);
  });
}

function fecharModalDelete() {
  document.querySelector('#overlay-delete').style.display = 'none';
}

async function deleteCoffee(id) {
  const response = await fetch(`${baseURL}/delete/${id}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });

  const result = await response.json();

  document.location.reload(true);

  fecharModalDelete();
}
