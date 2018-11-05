var myApp = new Framework7();
var db;

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true,
  domCache: true
});

function refresh() {
  fetchApresentacoes();
}

function Enviar1() {
  console.log("Deads ready!");
}

function gotoIndex() {
  window.location = "index.html";
}

$$(document).on('deleted', '.remove-callback', function () {
  var apresentacaoId = $$(this).attr('id');
  deletarApresentacao(apresentacaoId);
});

$$(document).on('deviceready', function () {
  fetchCampus();
  console.log("Device is ready!");
  db = window.openDatabase('apresentacao', '1.0', 'Apresentacao TCC', 1000000);
  createDatabase();
  getCampus();
});

myApp.onPageInit('index', function (page) {
  getCampus();
})

myApp.onPageInit('admin', function (page) {
  fetchApresentacoes();
})

//adicionar usuario
myApp.onPageInit('createlogin', function (page) {
  $$('.form-to-data').on('click', function () {
    var json = {
      usuario: $$('#usuario').val(),
      senha: $$('#senha').val(),
    }

    if ($$('#chave').val() == 2012204292 && $$('#usuario').val() != null && $$('#senha').val()) {
      cadastroUsuario(json);
      alert("Usuário Cadastrado!");
    } else {
      alert("Cadastro inválido!");
    }
  });
})

//adicionar usuario
myApp.onPageInit('login', function (page) {
  $$('.form-to-data').on('click', function () {
    var data = {
      usuario: $$('#usuario').val(),
      senha: $$('#senha').val(),
    }

  });
})

function validacao() {
  var data = {
    usuario: $$('#usuario').val(),
    senha: $$('#senha').val(),
  }

  if (data.usuario == "")
    alert("Favor inserir o usuário.");
  else if (data.senha == "")
    alert("Favor inserir a senha.")

  getUsuario(data);
}

//adicionar apresentacao
myApp.onPageInit('add', function (page) {
  $$('.form-to-data').on('click', function () {
    var data = {
      id: guidGenerator(),
      tema: $$('#tema').val(),
      data: $$('#data').val(),
      hora: $$('#hora').val(),
      aluno: $$('#aluno').val(),
      orientador: $$('#orientador').val(),
      sobre: $$('#sobre').val(),
      local: $$('#local').val(),
      campus: $$('#campus').val(),
    }

    if (data.tema == "")
      alert("Insira um tema.");
    else if (data.data == "")
      alert("Insira uma data.");
    else if (data.hora == "")
      alert("Insira um hora válida, exemplo: hh:mm.");
    else if (data.aluno == "")
      alert("Insira o nome do aluno.");
    else if (data.orientador == "")
      alert("Insira o nome do orientador.");
    else if (data.sobre == "")
      alert("Insira algo sobre apresentação.");
    else if (data.local == "")
      alert("Insira o local da apresentação.");
    else if (data.campus == "")
      alert("Insira o campus.");
    else
      cadastroApresentacao(data);
  });
})

function replaceBadInputs(val) {
  // Replace impossible inputs as the appear
  val = val.replace(/[^\dh:]/, "");
  val = val.replace(/^[^0-2]/, "");
  val = val.replace(/^([2-9])[4-9]/, "$1");
  val = val.replace(/^\d[:h]/, "");
  val = val.replace(/^([01][0-9])[^:h]/, "$1");
  val = val.replace(/^(2[0-3])[^:h]/, "$1");      
  val = val.replace(/^(\d{2}[:h])[^0-5]/, "$1");
  val = val.replace(/^(\d{2}h)./, "$1");      
  val = val.replace(/^(\d{2}:[0-5])[^0-9]/, "$1");
  val = val.replace(/^(\d{2}:\d[0-9])./, "$1");
  return val;
}

function validar(){
  var x = document.getElementById("hora");
  var val = x.value;
  var lastLength;
  do {
    // Loop over the input to apply rules repeately to pasted inputs
    lastLength = val.length;
    val = replaceBadInputs(val);
  } while(val.length > 0 && lastLength !== val.length);
  x.value = val;
};

myApp.onPageInit('apresentacoes', function (page) {
  var campus = page.query.id;
  fetchCampusId(campus);
})

//detalhe apresentacao
myApp.onPageInit('detalhe', function (page) {
  var apresentacaoID = page.query.id;
  fetchApresentacaoId(apresentacaoID);
})

function createDatabase() {
  db.transaction(createTable,
    function (tx, err) {
      alert('DB Error: ' + err);
    },
    function () {
    });
}

function createTable(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS login (id integer primary key autoincrement, usuario, senha)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS campus (id integer primary key autoincrement, campus)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS apresentacao (id unique, tema, data, hora, aluno, orientador, sobre, local, campus)');
  tx.executeSql('DELETE FROM campus');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"Alegre")');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"Jerônimo Monteiro")');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"Goiabeiras")');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"Maruípe")');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"São Matheus")');
}

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

//funcoes para criar usuario createlogin ----------------------------
function addLogin(login) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO login(id, usuario, senha) values (null,"' + login.usuario + '","' + login.senha + '")')
  },
    function (err) {
      console.log(err);
    },
    function () {
    });
}
//funcoes para criar usuario createlogin ----------------------------

//funcoes para autenticar login -------------------------------------

//funcoes para exibir apresentacao geral ----------------------------
function getApresentacaoCampus(id) {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM apresentacao where campus = (select campus from campus where id = "' + id + '") ORDER BY data DESC', [],
      function (tx, results) {
        var len = results.rows.length;
        console.log('apresentacao campus table: ' + len + 'rows found');
        for (var i = 0; i < len; i++) {
          $$('#apresentacao-list-campus').append(`
            <li class="swipeout remove-callback" id="${results.rows.item(i).id}">
              <a href="detalhe.html?id=${results.rows.item(i).id}" class="item-link swipeout-content item-content">
                <div class="item-inner">
                  <div class="item-title">${results.rows.item(i).tema}</div>
                  <div class="item-after">${results.rows.item(i).data}</div>
                </div>
              </a>
            </li>
            `);
        }
      },
      function (err) {
        console.log(err);
      });
  });
}
//funcoes para exibir apresentacao geral ----------------------------
//funcoes para apresentacao admin--------------------------------------------------------------------
function addApresentacao(app) {
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO apresentacao(id,tema,data,hora,aluno, orientador, sobre, local, campus) values ("' + app.id + '","' + app.tema + '","' + app.data + '","' + app.hora + '","' + app.aluno + '","' + app.orientador + '","' + app.sobre + '","' + app.local + '","' + app.campus + '")')
  },
    function (err) {
      console.log(err);
    },
    function () {
    });
}

function deletarApresentacao(id) {
  fetchdelApresentacao(id);
}
