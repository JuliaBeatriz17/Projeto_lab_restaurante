const buscarCardapio = async () => {
    const urlCardapio = 'https://rafaelescalfoni.github.io/desenv_web/restaurante/items.json';

    try {
        const response = await fetch(urlCardapio);
        const resposta = response.json()
        return resposta
    }
    catch (error) {
        alert('Sua requisição falhou. error:', error)
        return null
    }
};


(async () => {
    let cardapio = await buscarCardapio()
    const divCardapio = document.querySelector('#cardapio');
    const urlImagem = 'https://rafaelescalfoni.github.io/desenv_web/restaurante/'

    cardapio.forEach(prato => {
        const divFilha = document.createElement('div')

        divFilha.innerHTML = `
            <div class="col-md-6">
                <div class="item">
                <h3 id="code#${prato.code}" class="titlePlate">${prato.name}</h3>
                    <figure>
                        <img src="${urlImagem}${prato.photo}" alt="Produto sem Foto">
                    </figure>
                    <div title="${prato.details}" class="item-description">
                        ${prato.details}
                        <span>${prato.price}</span>
                    </div>
                </div>
            </div>
        `
        divCardapio.appendChild(divFilha)
    });
})()

function carrinho() {
    const menu = document.querySelectorAll(".item")
    let total = 0
    let totalDaCompra = 0
    let carrinho = []
    let controleCarrinho = true

    function adicionarItem(nome, preco, codeProduto) {
        this.nome = nome
        this.preco = parseFloat(preco.substr(2))
        this.codeProduto = codeProduto
    }

    const addChart = product => {
        carrinho.push(product)
    }

    const addProductList = (selector, product) => {
        const listaItensDOM = document.querySelector(selector)
        listaItensDOM.innerHTML += `<li id="carinho${product.codeProduto}" class="produtoNoCarinho"><p>${product.nome}</p> <button id="${product.codeProduto}" class="buttonRemove">Remover do pedido</button></li>`
    }

    const updateDisplay = (selector, value) => {
        const valorTotalDom = document.querySelector(selector)
        valorTotalDom.innerHTML = value.toFixed(2)
    }

    function exibirItensCarrinho() {
        const listaItensDOM = document.querySelector(".itens")
        listaItensDOM.innerHTML = ''
        updateDisplay(".total", 0)
        carrinho.forEach(produto => {
            addProductList(".itens", produto)
            //somar valor total
            totalDaCompra += produto.preco 
            updateDisplay(".total", totalDaCompra)
        })
    }

    function addButtonsMenu(item) {
        const nomeItem = item.querySelector(".titlePlate").textContent
        const precoItem = item.querySelector("span").textContent
        const codeProduto = item.querySelector('.titlePlate').id
        const produtoSelecionado = new adicionarItem(nomeItem, precoItem, codeProduto)
        // console.log(`Produto Escolhido: ${produtoSelecionado.preco}`)

        //adicionar no carrinho
        console.log(produtoSelecionado);

        //remover texto de carrinho vazio
        const carrinhoVazio = document.querySelector("#carrinhoVazio")
        if (carrinhoVazio) {
            carrinhoVazio.remove()
        }

        //exibir botões de fazer pedido e limpar carrinho 
        buttonFazerPedido.style.display = "block"
        buttonLimparCarrinho.style.display = "block"

        //salvar no localStorage
        addChart(produtoSelecionado)
        localStorage.setItem("Carrinho", JSON.stringify(carrinho))

        //exibir produtos do carrinho 
        exibirItensCarrinho()
        activeButtonRemove()
    }

    menu.forEach(item => {
        item.addEventListener("click", () => addButtonsMenu(item))
    })


    //Pegar os itens salvos e exibir na tela
    let produtosSalvos = JSON.parse(localStorage.getItem("Carrinho"))

    if (produtosSalvos) {
        produtosSalvos.forEach(produto => {
            addProductList(".itens", produto)

            total += produto.preco
            updateDisplay(".total", total)
        })
    }

    const buttonFazerPedido = document.querySelector('.buttonFazerPedido')
    const buttonLimparCarrinho = document.querySelector('.buttonLimparCarrinho')

    buttonLimparCarrinho.addEventListener('click', () => {
        updateDisplay(".total", 0)
        carrinho = []
        total = 0
        totalDaCompra = 0
        localStorage.clear()
        const listaItensDOM = document.querySelector(".itens")
        listaItensDOM.innerHTML = "<p id='carrinhoVazio'>Carrinho vazio</p>"

        const exibirTotal = document.querySelector("#exibirTotal")
        exibirTotal.classList.remove("ativo")

        buttonFazerPedido.style.display = "none"
        buttonLimparCarrinho.style.display = "none"
    })

    function activeButtonRemove() {

        const buttonsRemoveProduct = document.querySelectorAll('.buttonRemove')

        buttonsRemoveProduct.forEach((button, index) => {
            if (controleCarrinho == true) {

                button.addEventListener('click', () => {
                    carrinho = carrinho.filter((item, indexfilter) => indexfilter !== index)
                    exibirItensCarrinho()
                    activeButtonRemove()
                })
            } else {
                button.remove()
            }
        })
    }

    //Temporizador para cancelar o pedido do carrinho
    function temporizadorCarrinho() {

        const tempoPedido = 1000 * 60 * 1

        setTimeout(() => {
            controleCarrinho = false
            activeButtonRemove()
            buttonFazerPedido.style.display = "none"
            buttonLimparCarrinho.style.display = "none"

            menu.forEach(produto => {
                produto.removeEventListener("click", () => addButtonsMenu(produto))
            })
            console.log('acabou o tempo')
        }, tempoPedido)
    }

    const buttonConfirmarACompra = document.querySelector('#confirmarACompra')
    console.log(buttonConfirmarACompra)
    buttonConfirmarACompra.addEventListener("click", () => {
        temporizadorCarrinho()
        const textoDaCompra = document.querySelector('#textoCompraConfirmada')
        textoDaCompra.classList.add("ativo")
        buttonConfirmarACompra.classList.remove("ativo")
        activeButtonRemove()
    })

    //fazer pedido
    buttonFazerPedido.addEventListener('click', () => {
        const exibirTotal = document.querySelector('#exibirTotal')
        exibirTotal.classList.add("ativo")

        const totalPedidoTaxa = document.querySelector('#totalPedido')

        let valortotalPedidoTaxa = totalDaCompra + totalDaCompra * 0.1
        totalPedidoTaxa.innerHTML = `${valortotalPedidoTaxa}`

        buttonConfirmarACompra.classList.add("ativo")

        buttonFazerPedido.style.display = "none"
        buttonLimparCarrinho.style.display = "none"
        activeButtonRemove()
    })

    if (total === 0) {
        buttonFazerPedido.style.display = "none"
        buttonLimparCarrinho.style.display = "none"
    }

}

setTimeout(carrinho, 100)

