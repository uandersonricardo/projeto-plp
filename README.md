# colab.io — IDE web para PLP

![UFPE](https://img.shields.io/badge/UFPE-CIn-blue) ![Disciplina](https://img.shields.io/badge/IN1007-2026.1-blue) ![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## Resumo

`colab.io` é uma IDE web desenvolvida para a disciplina IN1007 — Paradigmas de Linguagens de Programação. Oferece notebooks interativos (células de código e markdown), execução client-side quando possível e integração com runtimes Java legados via `WebAPI`.

## Principais objetivos

- Modernizar a experiência prática da disciplina;
- Fornecer notebooks por linguagem com exemplos e documentação integrada.

## Visão geral da arquitetura

- Runtimes históricos: Java + JavaCC (parsers) e representação semântica em Java.
- Arquitetura atual: frontend `React + TypeScript` que consome serviços e snapshots expostos pelo `WebAPI`. A integração reaproveita parsers JavaCC e a representação Java existentes.

## Funcionalidades principais

- Notebooks interativos com múltiplas células (código e markdown).
- Execução incremental com feedback imediato (status: executado, erro de compilação, erro de execução).
- Editor por célula com seleção de linguagem.
- Snapshot padronizado: `CompilationSnapshot` (frames com `name`, `scope`, `bindings`, `sourceRange`).
- Depurador que consome esses snapshots e mostra escopos, bindings e nomes de procedimentos/classes.
- Seed de notebooks por linguagem com exemplos iniciais.

## Linguagens e status

| Linguagem | Status |
|-----------|--------|
| Exp1 | ✅ Suportada |
| Exp2 | ✅ Suportada |
| Func1 | ✅ Suportada |
| Func2 | ✅ Suportada |
| LF3 | ✅ Suportada |
| LI1 | ✅ Suportada |
| LI2 | ✅ Suportada |
| LOO1 | ✅ Suportada |
| LOO2 | ✅ Suportada |

Especificações formais (BNFs): https://augustosampaio.github.io/PLP/linguagens

## Exemplos rápidos

### Exp1 (LE1)
```txt
1 + 2
```

### Exp2 (LE2)
```txt
let var x = 10, var y = 5 in x - y
```

### Func1 (LF1)
```txt
let fun soma x y = x + y in soma(2,3)
```

### Func2 (LF2)
```txt
let fun add x = fn y . x + y in
    let var id = add(0), var x = 4 in
        id(1) + x
```

#### Func3 (LF3)

```txt
let fun positivo x = x > 0 in
    (let fun filter p xxs =
        if xxs == [] then [] 
        else let var x = head xxs, var xs = tail xxs in
        (if p(x) then x : filter(p, xs)
        else filter(p,xs)) in filter)(positivo, [1,-1, 0,-3,2,3,4])
```

#### Imperativa1 (LI1)

```txt
{
    var a = 3,
    var c = 0;
    read(c);
    write(a);
    write(c);
    { var a = 2,
        var b = 5,
        var c = false,
        var d = "oi";
        read(c);
        write(a);
        write(b+a);
        write(c);
        write(d)
    };
    write(a)
}
```

#### Imperativa2 (LI2)

```txt
{ 
     var a  =  1 ,
     proc incA (int z)  {
         a := a + z
     };
     call incA(3);
     call incA(5);
     write(a)
}
```

#### Objetos1 (LOO1)

```txt
{
        classe Contador {
                int valor = 10;
                proc print() {
                    write(this.valor)
                }
        }     
        ;

        {
            Contador c := new Contador
            ;
        write("Teste do write");
            c.print()
     }

 }
```

#### Objetos2 (LOO2)

```txt
{
    classe Eletrodomestico{
        boolean ligado = false,
        int voltagem = 220;
        
        Eletrodomestico(boolean ligado, int voltagem){
            this.ligado := ligado;
            this.voltagem := voltagem
        },            
        proc ligar(){
            this.ligado := true
        },
        proc desligar(){
            this.ligado := false
        },
        proc imprimeEstado(){
            write("Ligado: " ++ this.ligado);
            write("Voltagem: " ++ this.voltagem)
        }            
     };    
    {
        Eletrodomestico eletro := new Eletrodomestico(false,110);
        eletro.imprimeEstado();
        eletro.ligar();
        eletro.imprimeEstado()
    }
}
```

## Próximas ações

- Escopo por notebook (ao invés de por célula) de modo que  o programa resultante seja definido pela ordem de execução das células
- Visualização do ambiente de execução
- Deploy no site da disciplina

## Como executar (rápido)

Pré-requisitos: JDK 11+, Maven, Node 16+, npm/yarn.

### Compilar o WebAPI (Java):
```bash
$ sh build_java.sh
```

### Executar o GUI (desenvolvimento):

```bash
$ cd gui
$ npm install
$ npm run dev
```

## Equipe

| Nome | E-mail |
|------|--------|
| Matheus Vinicius Teotonio do Nascimento Andrade | mvtna@cin.ufpe.br |
| Uanderson Ricardo Ferreira da Silva | urfs@cin.ufpe.br |

# Como contribuir
1. Faça um fork e crie uma branch de feature.
2. Compile e teste localmente (GUI e/ou WebAPI).
3. Envie um PR com descrição clara e, quando possível, testes.

# Referências

- Repositório: https://github.com/uandersonricardo/projeto-plp
- BNFs das linguagens: https://augustosampaio.github.io/PLP/linguagens
