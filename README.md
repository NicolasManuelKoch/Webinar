# AI Chatbots, Connection & Well-being Webinar

A seven-page static webinar website with:
- One central video player per chapter
- Plain-language explanatory content
- Additional resource links
- A five-question interactive quiz with feedback, scoring, streak bonuses, and local best-score storage
- Responsive and keyboard-friendly design

## Open the site
Open `index.html` in a modern browser.

For the most reliable local preview, run a simple local server from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Replace the videos
Replace the MP4 files in `/media` while keeping the filenames unchanged:
1. `01-research-overview.mp4`
2. `02-knowledge-and-gaps.mp4`
3. `03-our-results.mp4`
4. `04-whats-ahead.mp4`
5. `05-ai-chatbot-tips.mp4`
6. `06-ai-challenges.mp4`
7. `07-thank-you.mp4`

The included videos are short silent title-card placeholders.

## Important: results page
The results page intentionally contains placeholders. Replace them only with verified final analyses before publishing.

## Edit content
- Page text and links: edit the relevant `.html` file.
- Quiz questions: edit `assets/app.js`.
- Design: edit `assets/style.css`.

## Publishing
The folder can be uploaded to GitHub Pages, Netlify, Cloudflare Pages, or any standard static web host.
