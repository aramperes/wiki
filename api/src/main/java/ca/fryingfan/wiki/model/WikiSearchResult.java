package ca.fryingfan.wiki.model;

public class WikiSearchResult {
    private final String title;
    private final String url;
    private final float score;

    public WikiSearchResult(String title, String url, float score) {
        this.title = title;
        this.url = url;
        this.score = score;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public float getScore() {
        return score;
    }
}
