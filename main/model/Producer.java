package model;

import java.util.concurrent.Semaphore;
import java.util.List;

public class Producer extends Thread{

    private List<Cliente> clientes;
    private Semaphore lock;   //mutex
    private Semaphore full;   //cheio -> para saber se pode consumir
    private int numOp;

    public Producer(List<Cliente> clientes, Semaphore sem, Semaphore count, int op){
        clientes = clientes;
        lock = sem;
        full = count;
        numOp = op;
    }
    @Override
    public void run(){
        System.out.println("NumOP:" + numOp);
        for(int i=0; i<numOp; i++){
            // int next = random.nextInt(this.numOp*130/100);

            try{
                //Lockar
                lock.acquire();      /// "down" do mutex da região crítica
                // Fila --> manda pra cada
                //  myList.add(next);

                full.release();   /// "up" do semáforo de posições ocupadas
                lock.release();
            }catch(InterruptedException ie){}
        }
        System.out.println("Producer out: " + full.availablePermits());

    }


}