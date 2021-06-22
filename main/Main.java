import model.Cliente;
import model.Container;
import model.Empacotadoras;
import model.Produto;
import utilitario.Calendario;
import utilitario.FileSystem;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {

    public static int quantPedidos = 0;
    public static Calendario calendario = new Calendario();
    public  static List<Container> containers = new ArrayList<Container>();
    public static void main(String[] args) throws InterruptedException {
        String escalonamento = Menu();
        startCalendar();
        // Iniciar container
        generateContainer();
        makeOption(escalonamento);
    }

    private static void generateContainer() {
        List<String> produtosArq = getProdutos();
        List<Produto> produtos = new ArrayList<Produto>();
        for (int i = 0; i < produtosArq.size(); i ++ ){
            String[] split = produtosArq.get(i).split(";");
            produtos.add(new Produto(Integer.valueOf(split[0]), Integer.valueOf(split[1])));
        }
        for (int i = 0; i < 4; i ++){
            containers.add(new Container(produtos.get(i).getId()));
        }
    }

    public static String Menu() {
        System.out.println("---------------------- Escolha o escalonamento: ---------------------- \n");
        System.out.println("1: SRT \n"
                + "2: First Come First Served \n"
                + "3: Fila de Prioridade Simples");

        Scanner leitor = new Scanner(System.in);
        return leitor.next();
    }

    public static void makeOption(String escalonamento) throws InterruptedException {
        switch (escalonamento) {
            case "1": SRT();
                break;
            case "2": FCFS();
                break;
            case "3": FilaSimples();
                break;
            default:
                throw new IllegalArgumentException("Unexpected value: " + escalonamento);
        }
    }

    public static void FilaSimples() throws InterruptedException {
        List<String> clientesArq = getClientes();
        List<Cliente> clientes = new ArrayList<Cliente>();
        List<Cliente> clientesPost = new ArrayList<Cliente>();
        for (int i = 0; i < quantPedidos; i++){
            int pos = getMenorQuant(clientesArq);
            String[] split = clientesArq.get(pos).split(";");
            Cliente cliente = new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2]),Integer.valueOf(split[3]),Integer.valueOf(split[4]));
            // Verifica se o cliente chegou no início
            if(cliente.getHoraChegada() == 0)
                clientes.add(cliente);
            else
                clientesPost.add(cliente);
            clientesArq.remove(pos);
        }
        new Empacotadoras(clientes, clientesPost, containers);
    }

    public static void FCFS() throws InterruptedException {
        List<String> clientesArq = getClientes();
        List<Cliente> clientes = new ArrayList<Cliente>();
        List<Cliente> clientesPost = new ArrayList<Cliente>();
        for (int i = 0; i < quantPedidos; i++){
            String[] split = clientesArq.get(0).split(";");
            Cliente cliente = new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2]),Integer.valueOf(split[3]),Integer.valueOf(split[4]));
            // Verifica se o cliente chegou no início
            if(cliente.getHoraChegada() == 0)
                clientes.add(cliente);
            else
                clientesPost.add(cliente);
            clientesArq.remove(0);
        }
        new Empacotadoras(clientes, clientesPost, containers);
    }

    public static void SRT() throws InterruptedException {
        List<String> clientesArq = getClientes();
        List<Cliente> clientes = new ArrayList<Cliente>();
        List<Cliente> clientesPost = new ArrayList<Cliente>();

        for (int i = 0; i < quantPedidos; i++){
            if (clientesArq.size() == 1){
                String[] split = clientesArq.get(0).split(";");
                clientes.add(new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2]),Integer.valueOf(split[3]),Integer.valueOf(split[4])));
                clientesArq.remove(0);
            }
            else {
                int pos = getLessTime(clientesArq);

                String[] split = clientesArq.get(pos).split(";");
                Cliente cliente = new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2]),Integer.valueOf(split[3]),Integer.valueOf(split[4]));
                // Verifica se o cliente chegou no início
                if(cliente.getHoraChegada() == 0)
                    clientes.add(cliente);
                else
                    clientesPost.add(cliente);
                clientesArq.remove(pos);
            }
        }
        // Passa os clientes para a empacotadora seguindo a ordem de menor tempo primeiro
        new Empacotadoras(clientes, clientesPost, containers);
    }

    // Função para organizar a lista com os clientes com menos produtos primeiro
    public static int getMenorQuant(List<String> list){
        int menor = Integer.MAX_VALUE;
        int pos = -1;
        for(int i = 0; i < list.size(); i++){
            String[] split = list.get(i).split(";");
            Cliente cliente = new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2]),Integer.valueOf(split[3]),Integer.valueOf(split[4]));
            if(cliente.getQuantProdutos() < menor){
                menor = cliente.getQuantProdutos();
                pos = i;
            }
        }
        return pos;
    }

    public static int getLessTime(List<String> list){
        int menor = Integer.MAX_VALUE;
        int pos = 0;
        for(int i = 0; i < list.size(); i++){
            String[] split = list.get(i).split(";");
            Cliente cliente = new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2]),Integer.valueOf(split[3]),Integer.valueOf(split[4]));
            if(cliente.getPrazoMin() < menor){
                menor = cliente.getPrazoMin();
                pos = i;
            }
        }
        return pos;
    }


    public static void startCalendar() {
        calendario.setarDiaSemana(1);
        calendario.setHoras(8);
        calendario.setMinutos(0);
        calendario.setSegundos(0);
        System.out.println("Data atual " + calendario.toString());
    }

    public static List<String> getClientes() {
        System.out.println("O empacotamento vai comecar na data " + calendario.toString() + "\n");
        List<String> clientesArq = new ArrayList<String>();
        clientesArq = FileSystem.ler("clientes.txt"); // le o arquivo clientes.txt, pega quantidade de pedidos e o remove da lista
        quantPedidos = Integer.valueOf(clientesArq.get(0));
        clientesArq.remove(0); // Remove a primeira posição que indicava a quantidade

        return clientesArq;
    }

    public static List<String> getProdutos(){
        // Lendo o arquivo de produtos e arrumando os containers
        List<String> produtosArq;
        produtosArq = FileSystem.ler("produtos.txt");
        int quantProdutos = Integer.parseInt(produtosArq.get(0));
        produtosArq.remove(0);
        return produtosArq;
    }
}