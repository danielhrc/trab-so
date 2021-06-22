package model;

public class Container {

    private int capacidadeAtual, capacidadeMax, tipoProduto, quantProduto;

    public Container(int tipoProduto, int quantProduto) {
        this.tipoProduto = tipoProduto;
        this.capacidadeMax = 1000000;
        this.quantProduto = quantProduto;
        this.capacidadeAtual = 1000000;
    }

    public int getCapacidadeAtual() { return capacidadeAtual; }

    public int getCapacidadeMax() { return capacidadeMax; }

    public int getTipoProduto() { return tipoProduto; }

    public void setTipoProduto(int tipoProduto) { this.tipoProduto = tipoProduto; }

    public void pegarProduto(int peso){
        this.capacidadeAtual -= peso;
    }
}
