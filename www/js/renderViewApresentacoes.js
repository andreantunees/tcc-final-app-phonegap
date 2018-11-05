function getApresentacoesCampus(data) {
    let count = 0;
    let element = $$('#apresentacao-list-campus');
    let concatenar = '';
    let tamanho = data.length;
    element.innerHTML = "";

    for (var i = 0; i < tamanho; i++) {

        concatenar += '<li class="swipeout remove-callback" id="' + data[i]._id + '">' +
            '<a href="detalhe.html?id=' + data[i]._id + '" class="item-link swipeout-content item-content">' +
            '<div class="item-inner">' +
            '<div class="item-title">' + data[i].tema + '</div>' +
            '</div>' +
            '</a>' +
            '</li>';
    }

    element.append(concatenar);
}

function getApresentacoes(data) {
    document.getElementById('apresentacaoGeral-list').innerHTML = "";
    
    let count = 0;
    let element = $$('#apresentacaoGeral-list');
    let tamanho = data.length;

    for (var i = 0; i < tamanho; i++) {

        //ajuste data
        var dataApresentacao = (data[i].data).toString();
        var position = 10;
        var dataOutput = dataApresentacao.slice(0, position);
        var dataOut = dataApresentacao.slice(8, position) + "/" + dataApresentacao.slice(5, 7) + "/" + dataApresentacao.slice(0, 4)

        element.append(`
                        <li class="swipeout remove-callback" id="${data[i]._id}">
                        <a href="detalhe.html?id=${data[i]._id}" class="item-link swipeout-content item-content">
                            <div class="item-inner">
                            <div class="item-title">${data[i].tema}</div>
                            <div class="item-after">${dataOut}</div>
                            </div>
                        </a>
                        <div class="swipeout-actions-right">
                            <a href="#" class="swipeout-delete">Delete</a>
                        </div>
                        </li>
                        `);
    }
}

function getApresentacao(data) {
    //ajuste hora
    var hora = data[0].hora.toString();
    var add = ":";
    var position = 2;
    var horaOutput = hora.slice(0, position) + add + hora.slice(position);

    //ajuste data
    var dataApresentacao = (data[0].data).toString();
    var position = 10;
    var dataOutput = dataApresentacao.slice(0, position);
    var dataOut = dataApresentacao.slice(8, position) + "/" + dataApresentacao.slice(5, 7) + "/" + dataApresentacao.slice(0, 4)

    $$('#apresentacao-detalhe').html(`
    <div class="card">
      <div class="card-header">${data[0].tema}</div>
      <div class="card-content">
        <div class="card-content-inner">
          <ul>
            <li>Aluno: ${data[0].aluno}</li>
            <li>Orientador: ${data[0].orientador}</li>
            <li>Sobre: ${data[0].sobre}</li>
            <li>Local: ${data[0].local}</li>
            <li>Campus: ${data[0].campus}</li>
          </ul>
        </div>
      </div>
      <div class="card-footer">Data: ${dataOut} às ${horaOutput}</div>
    </div>
  `);
}

const fetchApresentacao = async function (campus) {
    let response = await fetch(`${URL}/apresentation/` + campus);
    if (!response.ok) {
        throw new Error("Erro ao recuperar informações das apresentações do campus.");
    }

    let data = await response.json();
    getApresentacoesCampus(data);
}

const fetchApresentacaoId = async function (id) {
    let response = await fetch(`${URL}/apresentation/id/` + id);
    if (!response.ok) {
        throw new Error("Erro ao recuperar informações da apresentação.");
    }

    let data = await response.json();
    getApresentacao(data);
}

const fetchApresentacoes = async function () {
    let response = await fetch(`${URL}/apresentation`);
    if (!response.ok) {
        throw new Error("Erro ao recuperar informações das apresentações.");
    }

    let data = await response.json();
    getApresentacoes(data);
}

const cadastroApresentacao = async function (data) {
    var outDataHora = data.hora;
    var outHora = parseInt(outDataHora.slice(0,2) + outDataHora.slice(3,5));

    let response = await fetch(`${URL}/apresentation`,{
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tema: data.tema,
            data: new Date(data.data),
            hora: outHora,
            aluno: data.aluno,
            orientador: data.orientador,
            sobre: data.sobre,
            local: data.local,
            campus: data.campus
        })
    });  
    if(!response.ok){  
        throw new Error("Erro ao cadastrar apresentacao.");
    }

    var data = await response.json();
    alert("Apresentação cadastrada com sucesso.");
}

const fetchdelApresentacao = async function (id) {
    location.reload();
    let response = await fetch(`${URL}/apresentation`,{
         method: 'delete',
         headers:{
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({
             _id: id
         })
     });  
     if(!response.ok){  
         throw new Error("Erro ao deletar apresentacao.");
     }
 
    var data = await response.json();
    alert("Apresentação deletada com sucesso.");
 }