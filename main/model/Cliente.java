package model;

public class Cliente {

    private String nome;
    private int quantProdutos, prazoMin;

    public Cliente(String nome, int quantProdutos, int prazoMin) {
        this.nome = nome;
        this.quantProdutos = quantProdutos;
        // Caso o prazo for 0 significa que não existe prazo, então o sistema coloca o maior valor possível para a ordenação
        if (prazoMin == 0)
           this.prazoMin = Integer.MAX_VALUE;
        else
            this.prazoMin = prazoMin;
    }

    public String getNome() { return nome; }

    public void setNome(String nome) { this.nome = nome; }

    public Integer getQuantProdutos() { return quantProdutos; }

    public void setQuantProdutos(int quantProdutos) { this.quantProdutos = quantProdutos; }

    public int getPrazoMin() { return prazoMin; }

    public void setPrazoMin(int prazoMin) { this.prazoMin = prazoMin; }

    @Override
    public String toString() {
        return  nome + '\'' +
                ", quantidade de produtos " + quantProdutos +
                ", prazo " + prazoMin +
                " minutos \n";
    }
}
