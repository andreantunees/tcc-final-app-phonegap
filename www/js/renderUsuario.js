var $$ = Dom7;

const cadastroUsuario = async function (data) {
    let response = await fetch(`${URL}/usuario`,{
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: data.usuario,
            senha: data.senha
        })
    });  
    if(!response.ok){  
        throw new Error("Erro ao cadastrar usuario.");
    }

    var data = await response.json();
}

const getUsuario = async function (json) {
    let response = await fetch(`${URL}/usuario/` + json.usuario);  
    if(!response.ok){  
        throw new Error("Erro ao logar");
    }

    let data = await response.json();
    if(data.senha == json.senha){
        $$("#entrar").removeAttr("disabled");
        document.getElementById("validar").setAttribute("disabled", "disabled");
    }else{
        alert("Usuario e/ou senha incorreta.");
    }
}