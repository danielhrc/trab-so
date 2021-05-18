import model.Cliente;
import model.Empacotadora;
import utilitario.Calendario;
import utilitario.FileSystem;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class Main {

    public static int quantPedidos = 0;
    public static Calendario calendario = new Calendario();
    public static void main(String[] args) {
      String escalonamento = Menu();
      startCalendar();
      makeOption(escalonamento);
    }
    
    public static String Menu() {
    	System.out.println("---------------------- Escolha o escalonamento: ---------------------- \n");
    	System.out.println("1: SRT \n"
    			+ "2: First Come First Served \n"
    			+ "3: Fila de Prioridade Simples");
    	
    	Scanner leitor = new Scanner(System.in);
    	return leitor.next();
    }
    
    public static void makeOption(String escalonamento) {
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
    
    public static void FilaSimples() {
    	List<String> clientesArq = getClientes();
    	List<Cliente> clientes = new ArrayList<Cliente>();
    	
    	for (int i = 0; i < quantPedidos; i++){
            int pos = getMenorQuant(clientesArq);
            String[] split = clientesArq.get(pos).split(";");
            clientes.add(new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2])));
            clientesArq.remove(pos);
        }
    	
        // Passa os clientes para a empacotadora seguindo a ordem de menor tempo primeiro
        for (Cliente cliente: clientes) {
             Empacotadora.empacotar(cliente, calendario);
        }
    }
    
    public static void FCFS() {
    	List<String> clientesArq = getClientes();
    	List<Cliente> clientes = new ArrayList<Cliente>();
    	for (int i = 0; i < quantPedidos; i++){
            String[] split = clientesArq.get(0).split(";");
            clientes.add(new Cliente(split[0], Integer.valueOf(split[1]), Integer.valueOf(split[2])));
            clientesArq.remove(0);
        }
    	
    	for (Cliente cliente: clientes) {
            Empacotadora.empacotar(cliente, calendario);
       }
    }
    
    public static void SRT() {
    	List<String> clientesArq = getClientes();
    	List<Cliente> clientes = new ArrayList<Cliente>();
    	
        for (int i = 0; i < quantPedidos; i++){
            if (clientesArq.size() == 1){
                String[] split = clientesArq.get(0).split(";");
                clientes.add(new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2])));
                clientesArq.remove(0);
            }
            else {
                int pos = getLessTime(clientesArq);
                
                String[] split = clientesArq.get(pos).split(";");
                clientes.add(new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2])));
                clientesArq.remove(pos);
            }
        }
        // Passa os clientes para a empacotadora seguindo a ordem de menor tempo primeiro
        for (Cliente cliente: clientes) {
             Empacotadora.empacotar(cliente, calendario);
        }
  }

  // Função para organizar a lista com os clientes com menos produtos primeiro
  public static int getMenorQuant(List<String> list){
      int menor = Integer.MAX_VALUE;
      int pos = -1;
      for(int i = 0; i < list.size(); i++){
          String[] split = list.get(i).split(";");
          Cliente cliente = new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2]));
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
          Cliente cliente = new Cliente(split[0],Integer.valueOf(split[1]),Integer.valueOf(split[2]));
          if(cliente.getPrazoMin() < menor){
              menor = cliente.getPrazoMin();
              pos = i;
          }
      }
      return pos;
  }
  
  
  public static void startCalendar() {
  	System.out.println("Data atual " + calendario.toString());
      System.out.println(calendario.getHoras()); // O sistema verifica se está no horário de serviço da empresa, caso não esteja ele começa no outro dia
        if(calendario.getHoras() >= 17 || calendario.getHoras() < 8){
          System.out.println("Fora do horario de servi�o.");
          calendario.addDias(1);
          calendario.setarDiaSemana(1);
          calendario.setHoras(8);
          calendario.setMinutos(0);
          calendario.setSegundos(0);
      }
  }
  
  public static List<String> getClientes() {
  	System.out.println("O empacotamento vai come�ar na data " + calendario.toString() + "\n");
      List<String> clientesArq = new ArrayList<String>();
      clientesArq = FileSystem.ler("clientes.txt"); // le o arquivo clientes.txt, pega quantidade de pedidos e o remove da lista
      quantPedidos = Integer.valueOf(clientesArq.get(0));
      clientesArq.remove(0); // Remove a primeira posição que indicava a quantidade
      
      return clientesArq;
  }
}