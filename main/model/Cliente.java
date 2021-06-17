package model;

public class Cliente {

    private String nome;
    private int quantProdutos, prazoMin, horaChegada, codProduto;

    public Cliente(String nome, int quantProdutos, int prazoMin, int horaChegada, int codProduto) {
        this.nome = nome;
        this.quantProdutos = quantProdutos;
        // Caso o prazo for 0 significa que não existe prazo, então o sistema coloca o maior valor possível para a ordenação
        if (prazoMin == 0)
           this.prazoMin = Integer.MAX_VALUE;
        else
            this.prazoMin = prazoMin;
        this.horaChegada = horaChegada;
        this.codProduto = codProduto;
    }

    public String getNome() { return nome; }

    public void setNome(String nome) { this.nome = nome; }

    public int getQuantProdutos() { return quantProdutos; }

    public int getHoraChegada() { return horaChegada; }

    public void setHoraChegada(int horaChegada) { this.horaChegada = horaChegada; }

    public int getCodProduto() { return codProduto; }

    public void setCodProduto(int codProduto) { this.codProduto = codProduto; }

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
