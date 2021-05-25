package model;

import java.util.concurrent.Semaphore;
import java.util.List;

public class  Consumer extends Thread {

    private List<Cliente> clientes;
    private Semaphore lock;
    private Semaphore full;
    private int numOp;

    public Consumer(List<Cliente> clientes, Semaphore sem, Semaphore count, int op) {
        clientes = clientes;
        lock = sem;
        full = count;
        numOp = op;
    }

    @Override
    public void run() {
        for (int i = 0; i < numOp; i++) {
            try {

                // Semaforo lock
                full.acquire();    //"down" do mutex de posições ocupadas
                lock.acquire();    //"down do mutex


                // int next = random.nextInt(myList.size());  //-->depois do sorteio, a thread foi suspensa
                // myList.remove(next);

                // Semaforo release
                lock.release();    //"up" do mutex
            } catch (InterruptedException ie2) {
            }
        }
        System.out.println("Consumer out: " + full.availablePermits());

    }
}