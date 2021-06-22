package model;

import utilitario.Calendario;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.List;

public class Consumer extends Thread {

    private List<Cliente> clientes, clientesPost;
    private List<Container> containers;
    private Semaphore lock;
    private Semaphore full;
    private int numOp;
    private Double horario;
    private Calendario data;

    public Consumer(List<Container> containers,List<Cliente> clientes, List<Cliente> clientesPost, Semaphore sem, Semaphore count, int op) {
        this.clientes = clientes;
        this.clientesPost = clientesPost;
        lock = sem;
        full = count;
        numOp = op;
        this.containers = containers;
        this.data = new Calendario();
        this.data.zerarCalendario();
    }

    @Override
    public void run() {
        double horario = 0;
        int countTrocas = 0, segundosTroca = 0 ;
        Random aleat = new Random();
        List<Horario> horarios = new ArrayList<>();
        for (int i = 0; i < numOp ; i++){
            horarios.add(new Horario());
            try {

                // Semaforo lock
                full.acquire(); // "down" do mutex de posições ocupadas
                lock.acquire(); // "down do mutex
                sleep(200);

                // System.out.println("i: " + i);
                System.out.println("Num de clientes " + clientes.size());

                // Verifica container
                if(!Container.verificaContainers(clientes.get(i).getCodProduto(), containers)){
                    // Anotar troca
                    countTrocas ++;
                    segundosTroca += 30;
                    horarios.get(horarios.size() - 1 ).addTempo(30);
                    this.data.addSegundos(30);
                    System.out.println("Trocando o container");
                    int posAleat = aleat.nextInt(3);
                    containers.remove(posAleat);
                    containers.add(new Container(clientes.get(i).getCodProduto()));
                }

                horarios.get(horarios.size() - 1)
                        .addTempo(5.5 * (Double.parseDouble(String.valueOf(clientes.get(i).getQuantProdutos())) / 20) - 0.5);
                this.data.addSegundos(5.5 * (Double.parseDouble(String.valueOf(clientes.get(i).getQuantProdutos())) / 20) - 0.5);
                if(this.data.getHoras() < 12)
                    this.data.addAntesMeioDia();
                if(clientes.get(0).getPrazoMin() < Calendario.difMinutos(this.data))
                    this.data.addForaPrazo();
                System.out.println("Cliente: " + clientes.get(i));


                // Verifica se ainda possui clientes
                if(clientesPost.size() != 0){
                    if(clientesPost.get(0).getHoraChegada() <= Calendario.difMinutos(this.data)){
                        System.out.println("Adicionei o cliente " + clientesPost.get(0).getNome() + " que chegou no minuto " + clientesPost.get(0).getHoraChegada());
                        clientes.add(clientesPost.get(0));
                        // Organizar os clientes novamente
                        clientesPost.remove(0);
                    }
                }

                // Semaforo release
                lock.release(); // "up" do mutex

                if (this.data.getHoras() > 17){
                    System.out.println("Fim do expediente!!!");
                    return;
                }
        } catch (InterruptedException ie2) {
                System.out.println("ERRO " + ie2.toString());
            }
        }
        this.horario = horario + horarios.get((horarios.size() - 1)).getTempo();
        System.out.println("Consumer out: " + full.availablePermits());
        System.out.println("Nessa empacotadora " + this.data.getAntesMeioDia() + " clientes foram atendidos antes do meio dia.");
        System.out.println("Nessa empacotadora " + this.data.getForaPrazo() + " clientes foram atendidos fora do prazo.");
        System.out.println("Data do fim " + this.data.toString());
        System.out.println("Em relação as trocas de containers foram feitas " + countTrocas + " num total de " + segundosTroca + " segundos.");
    }

    public Double getHorario() { return this.horario; }

    public void setHorario(Double horario) { this.horario = horario; }
}