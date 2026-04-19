# Michael Chen Personal Website

Simple static personal website for [themichaelchen.com](https://themichaelchen.com), designed for Vercel deployment.

## Structure

- `index.html`: page structure
- `styles.css`: typography, layout, and responsive styling
- `script.js`: renders sections, the image modal, and the theme toggle
- `data/site-data.js`: profile, education, current work, and projects
- `assets/`: local project images or placeholders

## Editing content

All content lives in [data/site-data.js](/Users/michaelchen/Development/Personal%20Website/data/site-data.js).

Each project supports an optional `images` array:

```js
{
  title: "Project title",
  period: "2026",
  type: "product",
  typeLabel: "Project",
  summary: "Short summary.",
  details: "Optional supporting detail.",
  note: "Optional note.",
  link: { label: "Open link", url: "https://example.com" },
  images: [
    { src: "assets/project-1.jpg", alt: "Project image one" },
    { src: "assets/project-2.jpg", alt: "Project image two" },
  ],
}
```

## Deploying

### GitHub

1. Initialize the repo locally if needed: `git init`
2. Create a GitHub repo, for example `personal-website`
3. Push this directory to GitHub

### Vercel

1. Import the GitHub repo into Vercel
2. Framework preset: `Other`
3. Root directory: project root
4. Build command: leave empty
5. Output directory: leave empty
6. Add the custom domain `themichaelchen.com`

Because this is a static site, Vercel can deploy it directly without a build step.
