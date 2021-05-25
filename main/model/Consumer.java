package model;

import java.util.ArrayList;
import java.util.concurrent.Semaphore;
import java.util.List;

public class  Consumer extends Thread {

    private List<Cliente> clientes;
    private Semaphore lock;
    private Semaphore full;
    private int numOp;
    private Double horario;

    public Consumer(List<Cliente> clientes, Semaphore sem, Semaphore count, int op) {
        clientes = clientes;
        lock = sem;
        full = count;
        numOp = op;
    }

    @Override
    public void run() {

        List<Horario> horarios = new ArrayList<>();

        for (int i = 0; i < numOp; i++) {
            horarios.add(new Horario());
            try {

                // Semaforo lock
                full.acquire();    //"down" do mutex de posições ocupadas
                lock.acquire();    //"down do mutex

                horarios.get(horarios.size() -1)
                        .addTempo(5.5 * (Double.parseDouble(
                                clientes.get(i).getQuantProdutos().toString())/20) - 0.5);

                // int next = random.nextInt(myList.size());  //-->depois do sorteio, a thread foi suspensa
                // myList.remove(next);


                // Semaforo release
                lock.release();    //"up" do mutex
            } catch (InterruptedException ie2) {
            }
            horario = horario + horarios.get((horarios.size() -1)).getTempo();
        }
        System.out.println("Consumer out: " + full.availablePermits());

    }

    public Double getHorario() {
        return horario;
    }

    public void setHorario(Double horario) {
        this.horario = horario;
    }
}