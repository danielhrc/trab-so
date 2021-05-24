package utilitario;
import java.util.Date;

public class Calendario {

    // Classe que irÃ¡ controlar o tempo
    private int dia,mes,ano,horas, minutos;
    private String diaSemana;
    private double segundos;
    // Construtor pega os dados da data atual do sistema
    public Calendario(){
        Date data = new Date();
        this.dia = data.getDate();
        this.mes = data.getMonth() + 1;
        this.ano = data.getYear() + 1900;
        this.horas = data.getHours();
        this.minutos = data.getMinutes();
        this.segundos = data.getSeconds();
        switch (data.getDay()){
            case 0: this.diaSemana = "Domingo";
            break;
            case 1: this.diaSemana = "Segunda-Feira";
                break;
            case 2: this.diaSemana = "Terça-Feira";
                break;
            case 3: this.diaSemana = "Quarta-Feira";
                break;
            case 4: this.diaSemana = "Quinta-Feira";
                break;
            case 5: this.diaSemana = "Sexta-Feira";
                break;
            case 6: this.diaSemana = "Sabado";
                break;
        }
    }

    public void setarDiaSemana(int dias){
        int numDiaSemana = -1;
        switch (diaSemana){
            case "Domingo": numDiaSemana = 0;
                break;
            case "Segunda-Feira": numDiaSemana = 1;
                break;
            case "Terça-Feira": numDiaSemana = 2;
                break;
            case "Quarta-Feira": numDiaSemana = 3;
                break;
            case "Quinta-Feira": numDiaSemana = 4;
                break;
            case "Sexta-Feira": numDiaSemana = 5;
                break;
            case "Sabado": numDiaSemana = 6;
                break;
        }
        numDiaSemana += dias;
        while (numDiaSemana > 6){
            numDiaSemana = numDiaSemana - 7;
        }
        switch (numDiaSemana){
            case 0: this.diaSemana = "Domingo";
                break;
            case 1: this.diaSemana = "Segunda-Feira";
                break;
            case 2: this.diaSemana = "Terça-Feira";
                break;
            case 3: this.diaSemana = "Quarta-Feira";
                break;
            case 4: this.diaSemana = "Quinta-Feira";
                break;
            case 5: this.diaSemana = "Sexta-Feira";
                break;
            case 6: this.diaSemana = "Sabado";
                break;
        }
    }
    public void addSegundos(double segundos){
        this.segundos += segundos;
        while (this.segundos >= 60){
            addMinutos(1);
            this.segundos = this.segundos - 60;
        }
    }

    public void addMinutos(int minutos) {
        this.minutos += minutos;
        while (this.minutos >= 60){
            addHoras(1);
            this.minutos = this.minutos - 60;
        }
    }

    public void addHoras(int horas){
        this.horas += horas;
        while (this.horas >= 24){
            addDias(1);
            setarDiaSemana(1);
            this.horas = this.horas - 24;
        }
    }

    public void addDias(int dias){
        this.dia += dias;
        switch (this.mes){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
                case 10:
            case 12:
                while (this.dia >= 31){
                    addMes(1);
                    this.dia = this.dia - 31;
                }
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                while (this.dia >= 30){
                    addMes(1);
                    this.dia = this.dia - 30;
                }
                break;
            case 2:
                while (this.dia >= 28){
                    addMes(1);
                    this.dia = this.dia - 28;
                }
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + this.mes);
        }

    }

    public void addMes(int meses){
        this.mes += meses;
        while (this.mes >= 12){
            this.mes = this.mes - 11;
            this.ano ++;
        }
    }

    public int getDia() { return dia; }

    public int getMes() { return mes; }

    public int getAno() { return ano; }

    public int getHoras() { return horas; }

    public int getMinutos() { return minutos; }

    public String getDiaSemana() { return diaSemana; }

    public double getSegundos() { return segundos; }

    public void setDia(int dia) { this.dia = dia; }

    public void setMes(int mes) { this.mes = mes; }

    public void setAno(int ano) { this.ano = ano; }

    public void setHoras(int horas) { this.horas = horas; }

    public void setMinutos(int minutos) { this.minutos = minutos; }

    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }

    public void setSegundos(double segundos) { this.segundos = segundos; }

    @Override
    public String toString() {
        return diaSemana + " "+
                dia +
                "/" + mes +
                "/" + ano + " " +
               horas +":" + minutos + ":" + segundos;
    }

    public static int difMinutos(Calendario data, int diaAtual){
        if(data.getHoras() == 8 && data.getMinutos() ==0)
            return 0;
        else{
            int min = 0;
            int horas = data.getHoras();
            while (horas != 8){
                horas--;
                min += 60;
            }
            int minutos = data.getMinutos();
            while (minutos != 0){
                minutos--;
                min ++;
            }
            int dias = data.getDia();
            while (dias != diaAtual){
                dias --;
                min+= 1440;
            }
            return min;
        }
    }
}

