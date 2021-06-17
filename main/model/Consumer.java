package model;

import utilitario.Calendario;

import java.util.ArrayList;
import java.util.concurrent.Semaphore;
import java.util.List;

public class Consumer extends Thread {

    private List<Cliente> clientes;
    private Semaphore lock;
    private Semaphore full;
    private int numOp;
    private Double horario;
    private Calendario data;

    public Consumer(List<Cliente> clientes, Semaphore sem, Semaphore count, int op) {
        this.clientes = clientes;
        lock = sem;
        full = count;
        numOp = op;
        this.data = new Calendario();
        this.data.zerarCalendario();
    }

    @Override
    public void run() {
        double horario = 0;
        List<Horario> horarios = new ArrayList<>();

        for (int i = 0; i < numOp; i++) {
            horarios.add(new Horario());
            try {

                // Semaforo lock
                full.acquire(); // "down" do mutex de posições ocupadas
                lock.acquire(); // "down do mutex
                sleep(200);

                System.out.println("i: " + i);
                System.out.println(clientes.size());

                horarios.get(horarios.size() - 1)
                        .addTempo(5.5 * (Double.parseDouble(String.valueOf(clientes.get(i).getQuantProdutos())) / 20) - 0.5);
                this.data.addSegundos(5.5 * (Double.parseDouble(String.valueOf(clientes.get(i).getQuantProdutos())) / 20) - 0.5);
                if(this.data.getHoras() < 12)
                    this.data.addAntesMeioDia();
                if(clientes.get(i).getPrazoMin() < Calendario.difMinutos(this.data))
                    this.data.addForaPrazo();
                System.out.println("Cliente: " + clientes.get(i));

                // int next = random.nextInt(myList.size()); //-->depois do sorteio, a thread
                // foi suspensa
                // myList.remove(next);

                // Semaforo release
                lock.release(); // "up" do mutex
            } catch (InterruptedException ie2) {
            }
            this.horario = horario + horarios.get((horarios.size() - 1)).getTempo();
        }
        System.out.println("Consumer out: " + full.availablePermits());
        System.out.println("Nessa empacotadora " + this.data.getAntesMeioDia() + " clientes foram atendidos antes do meio dia.");
        System.out.println("Nessa empacotadora " + this.data.getForaPrazo() + " clientes foram atendidos fora do prazo.");
        System.out.println("Data do fim " + this.data.toString());

    }

    public Double getHorario() {
        return this.horario;
    }

    public void setHorario(Double horario) {
        this.horario = horario;
    }
}
