package model;

public class Produto {

    private int id, volume;

    public Produto(int id, int volume) {
        this.id = id;
        this.volume = volume;
    }

    public int getId() { return id; }

    public void setId(int id) { this.id = id; }

    public int getVolume() { return volume; }

    public void setVolume(int volume) { this.volume = volume; }


}
