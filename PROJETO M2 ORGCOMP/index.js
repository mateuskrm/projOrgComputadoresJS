import { Instrucao } from "./Instrucao.js";
import LinkedList from "dbly-linked-list";
import events from "events";
import fs from "fs";
import readline from "readline";

var instrucoesTipoU = ['0110111', '0010111'];
var instrucoesTipoJ = ['1101111', '1100111'];
var instrucoesTipoB = ['1100011'];
var instrucoesTipoIM = ['0000011'];
var instrucoesTipoS = ['0100011'];
var instrucoesTipoR = ['0110011'];
var instrucoesTipoIAE = ['0010011', '1110011'];

function calcularImprimirDesempenho(orgProps) {

    // Calcula o sobrecusto entre a solução original e a solução modificada
	orgProps.sobreCustoInstrucao = orgProps.contadorInstrucaoModificado - orgProps.contadorInstrucaoOriginal;
    // Calcula o CPI,considerando os 5 ciclos da arquitetura pipeline e 1 instrução completa por ciclo
	orgProps.CPI = (5 + 1 * (orgProps.contadorInstrucaoModificado - 1)) / orgProps.contadorInstrucaoModificado;
    // Total de ciclos do programa 
	orgProps.ciclosProg = (5 + 1 * (orgProps.contadorInstrucaoModificado - 1));
    // Tempo de execução Original
	orgProps.tExecOriginal = orgProps.contadorInstrucaoOriginal * orgProps.CPI * orgProps.tempoClock;
    // Tempo de execução Modificado
    orgProps.tExecModificado = orgProps.contadorInstrucaoModificado * orgProps.CPI * orgProps.tempoClock;

	console.log("Sobrecusto em instrucõess do programa: " + orgProps.sobreCustoInstrucao);
	console.log("Ciclos por Instrucão(CPI) do programa: " + Math.round(orgProps.CPI * 100) / 100);
	console.log("Número de Ciclos do Programa: " + orgProps.ciclosProg);
	console.log("Tempo de Execucão Original: " + Math.round(orgProps.tExecOriginal * 100) / 100);
	console.log("Tempo de Execucão Modificado: " + Math.round(orgProps.tExecModificado * 100) / 100);
	console.log("O tempo Original é " + Math.round((orgProps.tExecModificado /  orgProps.tExecOriginal ) * 100) / 100 + " vezes mais rápido do que o modificado.");
}

async function processaArquivo(arquivo, orgProps)
{
    var list = new LinkedList();
    var arquivoAberto = fs.createReadStream(arquivo);
    const rl = readline.createInterface({
        input: arquivoAberto,
        crlfDelay: Infinity
    })
   
    rl.on('line', (line) => {
        orgProps.contadorInstrucaoOriginal++;
        list.insert(line);
    })

    await events.once(rl, 'close');
    return list;
}

function verificaInstrucao(instrucao){
   var operacao = instrucao?.substring(25);
   if(instrucao == "00000000000000000000000000010011 nop" || instrucao == "00000000000000000000000001110011"){
        return "NOP";
   }else if(instrucoesTipoU.includes(operacao)){
        return "U";
    }
    else if(instrucoesTipoJ.includes(operacao)){
        return "J";
    }
    else if(instrucoesTipoB.includes(operacao)){
        return "B";
    }
    else if(instrucoesTipoIM.includes(operacao)){
        return "IM";
    }
    else if(instrucoesTipoS.includes(operacao)){
        return "S";
    }
    else if(instrucoesTipoR.includes(operacao)){
        return "R";
    }
    else if(instrucoesTipoIAE.includes(operacao)){
        return "IAE";
    }
    return "";  
}

function analisaLista(lista){
    var aux = null;
    var aux1 = null;
    var aux2 = null;
    var jaInseriu = false;
    var instrucao1 = new Instrucao();
    var instrucao2 = new Instrucao();
    var instrucao3 = new Instrucao();
    var verificInst1 = '';
    var verificInst2 = '';
    var verificInst3 = '';

    if(!lista?.isEmpty()){
        aux = lista?.getHeadNode();

        while(aux?.hasNext()){
            jaInseriu = false;
            instrucao1.instrucaoCompleta = aux?.getData();
            instrucao1.codigoOperacao = instrucao1?.instrucaoCompleta?.substring(25);
            instrucao1.registradorDest = instrucao1?.instrucaoCompleta?.substring(20, 25);
            instrucao1.registrador1 = instrucao1?.instrucaoCompleta?.substring(12,17);        
            instrucao1.registrador2 = instrucao1?.instrucaoCompleta?.substring(7,12);

            if(aux?.hasNext()){
                aux1 = aux.next;
                instrucao2.instrucaoCompleta = aux1?.getData();
                instrucao2.codigoOperacao = instrucao2?.instrucaoCompleta?.substring(25);
                instrucao2.registradorDest = instrucao2?.instrucaoCompleta?.substring(20, 25);
                instrucao2.registrador1 = instrucao2?.instrucaoCompleta?.substring(12,17);
                instrucao2.registrador2 = instrucao2?.instrucaoCompleta?.substring(7,12);

                if(aux1?.hasNext())
                {
                    aux2 = aux1?.next;
                    instrucao3.instrucaoCompleta = aux2?.getData();
                    instrucao3.codigoOperacao = instrucao3.instrucaoCompleta?.substring(25);
                    instrucao3.registradorDest = instrucao3.instrucaoCompleta?.substring(20, 25);
                    instrucao3.registrador1 = instrucao3.instrucaoCompleta?.substring(12,17);
                    instrucao3.registrador2 = instrucao3.instrucaoCompleta?.substring(7,12);

                }else
                {
                    aux2 = null;
                    instrucao3.instrucaoCompleta = null;
                    instrucao3.codigoOperacao = null;
                    instrucao3.registradorDest = null;
                    instrucao3.registrador1 = null;
                    instrucao3.registrador2 = null;

                }
            }
            else{
                aux1 = null;
                instrucao2.instrucaoCompleta = null;
                instrucao2.codigoOperacao = null;
                instrucao2.registradorDest = null;
                instrucao2.registrador1 = null;
                instrucao2.registrador2 = null;
            }

            verificInst1 = verificaInstrucao(instrucao1?.instrucaoCompleta);
            if(aux1 != null){
                verificInst2 = verificaInstrucao(instrucao2?.instrucaoCompleta);
                if(aux2 != null){
                    verificInst3 = verificaInstrucao(instrucao3?.instrucaoCompleta);
                }
            }


            if(verificInst1 != "NOP"){
                if(aux1 != null && verificInst2 == "J")
                {
                    
                    lista.insertAfter(aux?.getData(), "00000000000000000000000000010011 nop");
        
                }else if(verificInst1 == "IAE"|| verificInst1 == "U" || verificInst1 == "IM" || verificInst1 == "R")
                {
                    if(aux1 != null){
                        if(verificInst2 == "B" || verificInst2 == "S" || verificInst2 == "R")
                        {
                            if(instrucao1.registradorDest == instrucao2.registrador1 || instrucao1.registradorDest == instrucao2.registrador2)
                            {

                                lista.insertAfter(aux?.getData(), "00000000000000000000000000010011 nop");
                                lista.insertAfter(aux?.getData(), "00000000000000000000000000010011 nop");
                                jaInseriu = true;
                            }
                            
                        }else if(verificInst2 == "IM" || verificInst2 == "IAE")
                        {
                            if(instrucao1.registradorDest == instrucao2.registrador1)
                            {
                                lista.insertAfter(aux?.getData(), "00000000000000000000000000010011 nop");
                                lista.insertAfter(aux?.getData(), "00000000000000000000000000010011 nop");
                                jaInseriu = true;
                            }
                        }   
                        if(aux2 != null && !jaInseriu){
                            if(verificInst3 == "B" || verificInst3 == "S" || verificInst3 == "R")
                            {
                                if(instrucao1.registradorDest == instrucao3.registrador1 || instrucao1.registradorDest == instrucao3.registrador2)
                                {
                                    lista.insertAfter(aux?.getData(), "00000000000000000000000000010011 nop");
                                    
                                }
                            }else if(verificInst3 == "IM" || verificInst3 == "IAE")
                            {
                                if(instrucao1.registradorDest == instrucao3.registrador1)
                                {
                                    lista.insertAfter(aux?.getData(), "00000000000000000000000000010011 nop");
                                    
                                }
                            }
                        }
                    }
                }
            }

            if(aux?.hasNext()){
                aux = aux?.next;
            }
        }
    }
}

function escreveArquivoModificado(lista, orgProps){
    var arquivo = fs.createWriteStream('arquivoModificado.txt');
    orgProps.contadorInstrucaoModificado = 0;

    lista?.forEach(function(x){
        arquivo.write(x.getData());
        orgProps.contadorInstrucaoModificado++;
        arquivo.write("\n");
    })

    arquivo.end();
}

async function main(){
    let orgProps = {
        contadorInstrucaoOriginal: 0,
        contadorInstrucaoModificado: 0,
        sobreCustoInstrucao: 0,
        CPI: 0,
        ciclosProg: 0,
        tempoClock: 0,
        tExec: 0
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Insira o tempo de clock: ', (tempoClock) => {
        orgProps.tempoClock = tempoClock;

        rl.question('Insira o nome do arquivo com extensão aqui: ', async (arquivo) => {
            var lista = await processaArquivo(arquivo, orgProps);
            analisaLista(lista);
            escreveArquivoModificado(lista, orgProps);
            calcularImprimirDesempenho(orgProps);
            rl.close();
        });
    });
}

main();
