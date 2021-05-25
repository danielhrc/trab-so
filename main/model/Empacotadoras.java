package model;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Semaphore;

public class Empacotadoras extends Thread{
    private Double tempoTotal;
    private List<Cliente> list;

    public Empacotadoras(List<Cliente> list) throws InterruptedException {
        Semaphore listLock = new Semaphore(1);    //mutex para acesso à lista
        Semaphore countItems = new Semaphore(0);

        /* THREADS */
        Producer prod = new Producer(list, listLock, countItems, list.size());
        Consumer empacotadora1 = new Consumer(list, listLock, countItems, list.size()/2);
        Consumer empacotadora2 = new Consumer(list, listLock, countItems, list.size()/2);
        /* FIM THREADS */


        try{
            prod.start();
            empacotadora1.start();
            sleep(10);
            empacotadora2.start();
            prod.join();
            empacotadora1.join();
            empacotadora2.join();
        } catch(InterruptedException ie){};

        tempoTotal = empacotadora1.getHorario() > empacotadora2.getHorario() ? empacotadora1.getHorario() : empacotadora2.getHorario();



        System.out.println("Tempo: " + tempoTotal);

        
    };

    

    
    

   
}
