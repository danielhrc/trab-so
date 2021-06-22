package model;

import java.util.List;

public class Container {

    private int capacidadeAtual, capacidadeMax, tipoProduto;

    public Container(int tipoProduto) {
        this.tipoProduto = tipoProduto;
        this.capacidadeMax = 1000000;
        this.capacidadeAtual = 1000000;
    }

    public static boolean verificaContainers(int tipoProduto, List<Container> containers){
        for(Container container:containers){
            if(container.tipoProduto == tipoProduto)
                return true;
        }
        return false;
    }

    public int getCapacidadeAtual() { return capacidadeAtual; }

    public int getCapacidadeMax() { return capacidadeMax; }

    public int getTipoProduto() { return tipoProduto; }

    public void setTipoProduto(int tipoProduto) { this.tipoProduto = tipoProduto; }

    public void pegarProduto(int peso){
        this.capacidadeAtual -= peso;
    }

    @Override
    public String toString() {
        return "Container{" +
                "capacidadeAtual=" + capacidadeAtual +
                ", capacidadeMax=" + capacidadeMax +
                ", tipoProduto=" + tipoProduto +
                '}';
    }
}
