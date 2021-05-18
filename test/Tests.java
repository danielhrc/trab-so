import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

public class Tests {

    @Test
    public void filaTest() {
        List fila = new ArrayList<>();

        fila.add(new Pedido());
        fila.add(new Pedido());
        fila.add(new Pedido());

        assertEquals(3, fila.size());
    }


    @Test
    public void semaforoTest(){
        int numeroPedidosFinal = 0;
        int numeroPedidosInicial = 1000;

        Esteira esteira1 = new Esteira();
        Esteira esteira2 = new Esteira();


        assertEquals(numeroPedidosFinal, numeroPedidosInicial);
    }

    @Test
    public void multiThreadTest(){
        int pedidosIniciais = 0;
        int pedidosEntregues = 100;


        assertEquals(pedidosIniciais, pedidosEntregues );
    }


}
