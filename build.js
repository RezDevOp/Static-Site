const fs = require("fs-extra");
const path = require("path");
const { marked } = require("marked");
const frontMatter = require("front-matter");

// Configure marked for security
marked.setOptions({
  headerIds: false,
  mangle: false,
});

// Paths
const contentDir = path.join(__dirname, "src", "content");
const templateDir = path.join(__dirname, "src", "templates");
const publicDir = path.join(__dirname, "public");

// Ensure public directory exists
fs.ensureDirSync(publicDir);

// Read base template
const baseTemplate = fs.readFileSync(
  path.join(templateDir, "base.html"),
  "utf-8"
);

// Function to convert markdown to HTML
function convertMarkdownToHtml(markdown, template) {
  const { attributes, body } = frontMatter(markdown);
  const content = marked.parse(body);

  return template
    .replace("{{title}}", attributes.title || "My Website")
    .replace("{{content}}", content);
}

// Function to process a markdown file
function processMarkdownFile(filePath) {
  const markdown = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(contentDir, filePath);
  const outputPath = path.join(publicDir, relativePath.replace(".md", ".html"));

  // Create output directory if it doesn't exist
  fs.ensureDirSync(path.dirname(outputPath));

  // Convert and save
  const html = convertMarkdownToHtml(markdown, baseTemplate);
  fs.writeFileSync(outputPath, html);
  console.log(`Converted ${relativePath} to HTML`);
}

// Function to copy static assets
function copyStaticAssets() {
  // Copy styles
  fs.copySync(
    path.join(__dirname, "src", "styles"),
    path.join(publicDir, "styles")
  );

  // Copy scripts
  fs.copySync(
    path.join(__dirname, "src", "scripts"),
    path.join(publicDir, "scripts")
  );

  console.log("Copied static assets");
}

// Main build function
async function build() {
  try {
    // Process all markdown files
    const files = await fs.readdir(contentDir);
    for (const file of files) {
      if (file.endsWith(".md")) {
        processMarkdownFile(path.join(contentDir, file));
      }
    }

    // Copy static assets
    copyStaticAssets();

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

// Run build
build();
