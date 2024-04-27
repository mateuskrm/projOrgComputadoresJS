const dbl = require("dbly-linked-list");


function processaArquivo(arquivo)
{
    const fs = require('fs');
    const readline = require('readline');
    var list = new dbl();
    var arquivoAberto = fs.createReadStream(arquivo);
    const rl = readline.createInterface({
        input: arquivoAberto,
        crlfDelay: Infinity
    })
   
    for await (const line of rl)
    {
        list.insert(line);
    }
    return list;
}

function analisaLista(lista){
    var noAux = lista.getHeadNode();
    var aux = lista.getHeadNode().getData();
    var aux1 = null;
    var aux2 = null;
    var instrucao1 = new Instrucao();
    var instrucao2 = new Instrucao();
    var instrucao3 = new Instrucao();
    lista.forEach(function(x){
        instrucao1.instrucaoCompleta = x;
        instrucao1.codigoOperacao = x.substring(25);
        instrucao1.registradorDest = x.substring(20, 24);
        instrucao1.registrador1 = x.substring(12,16);        
        instrucao1.registrador2 = x.substring(7,11);

        if(aux.hasNext()){
            aux1 = aux.next;
            if(aux1.hasNext())
            {
                aux2 = aux1.next;
            }else
            {
                aux2 = null;
            }
        }
        else{
            aux1 = null;
        }
    })
}

function main(){
    var prompt = require('prompt-sync')();
    var ciclo = prompt('Blablabla ciclos: ');
    var arquivo = prompt('Insira o nome do arquivo com extensão aqui: ');
    var lista = processaArquivo(arquivo);
    analisaLista(lista);
}