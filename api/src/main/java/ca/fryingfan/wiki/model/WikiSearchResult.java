package ca.fryingfan.wiki.model;

public class WikiSearchResult {
    private final String title;
    private final String url;
    private final float score;
    private final String excerpt;

    public WikiSearchResult(String title, String url, float score, String excerpt) {
        this.title = title;
        this.url = url;
        this.score = score;
        this.excerpt = excerpt;
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

    public String getExcerpt() {
        return excerpt;
    }
}
