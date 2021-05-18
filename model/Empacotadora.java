package model;

import utilitario.Calendario;

public class Empacotadora {

    // Essa função recebe um cliente e uma data, calcula o tempo de empacotamento do cliente e retorna
     public static Calendario empacotar(Cliente cliente, Calendario data){
         System.out.println("O cliente " + cliente.getNome() + " tem " + cliente.getQuantProdutos() + " produtos para empacotar.");
         System.out.println("O empacotamento come�ou em " + data.toString());

         // Cada produto possui 250cm³ e produção de pacote pode produzir 5000cm³ por vez, maximizando 20 produtos de uma vez
         if(cliente.getQuantProdutos() > 20){
             while (cliente.getQuantProdutos() >20){
                 // Empacotando
                 data.addSegundos(5);
                 // Braço mecânico
                 data.addSegundos(0.5);
                 cliente.setQuantProdutos(cliente.getQuantProdutos()-20);
                 // Verifica se após o término o expediente acabou
                 verificarExpediente(data);
             }
         }
         // Verifica se sobrou algum produto
         if (cliente.getQuantProdutos() > 0){
             // Empacotando
             data.addSegundos(5);
             // Braço mecânico
             data.addSegundos(0.5);
             // Verifica se após o término o expediente acabou
             verificarExpediente(data);
         }
         System.out.println("O empacotamento terminou em " + data.toString() + "\n\n");
         return data;
     }

     public static Calendario verificarExpediente(Calendario data){
         // Verifica se após o término o expediente acabou
         if(data.getHoras() >= 17 || data.getHoras() < 8){
             System.out.println("Fim de expediente.");
             data.addDias(1);
             data.setarDiaSemana(1);
             data.setHoras(8);
             data.setMinutos(0);
             data.setSegundos(0);
         }
         return data;
     }
}
