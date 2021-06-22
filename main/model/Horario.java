package model;

public class Horario {

    private double tempo;

    public Horario(){};

    public void addTempo(double v) { this.tempo += v; }

    public double getTempo() {
        return this.tempo;
    }

    public double fromSecToMinutes(){
        return this.tempo/60;
    }

    public double fromSecToHours() {
        return this.tempo/3600;
    }


}