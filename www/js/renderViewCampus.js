function getCampus(data){
    let count = 0;
    let element = $$('#campus-list');
    let concatenar = '';
    let tamanho = data.length;
    element.innerHTML = "";
    
    for( var i = 0; i < tamanho ; i++){
        
        concatenar += '<li class="swipeout remove-callback" id="' + data[i]._id + '">' +
                            '<a href="apresentacoes.html?id=' + data[i]._id +'" class="item-link swipeout-content item-content">' +
                                '<div class="item-inner">'+
                                    '<div class="item-title">' + data[i].nome +'</div>'+
                                '</div>'+
                            '</a>'+
                        '</li>';
    }
    
    element.append(concatenar);
}

const fetchCampus = async function () {
    let response = await fetch(`${URL}/campus`);  
    if(!response.ok){  
        throw new Error("Erro ao recuperar informações dos campus.");
    }

    let data = await response.json();
    getCampus(data);
}

const fetchCampusId = async function (id) {
    let response = await fetch(`${URL}/campus/` + id);  
    if(!response.ok){  
        throw new Error("Erro ao recuperar informações do campus.");
    }

    let data = await response.json();
    fetchApresentacao(data[0].nome);
}