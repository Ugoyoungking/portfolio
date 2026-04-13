(function renderGithubProjects() {
  const grid = document.getElementById('githubProjects');
  if (!grid) return;

  const username = 'Ugoyoungking';
  const endpoint = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;

  const fallback = (message) => {
    grid.innerHTML = `<p class="project-empty">${message}</p>`;
  };

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
      }
      return response.json();
    })
    .then((repos) => {
      const items = repos
        .filter((repo) => !repo.fork)
        .slice(0, 6)
        .map((repo) => {
          const description = repo.description || 'No description available yet.';
          const language = repo.language || 'N/A';
          const stars = repo.stargazers_count ?? 0;
          const updated = new Date(repo.updated_at).toLocaleDateString();

          return `
            <article class="project github-project">
              <h4>${repo.name}</h4>
              <p>${description}</p>
              <div class="github-meta">
                <span>🧩 ${language}</span>
                <span>⭐ ${stars}</span>
                <span>🕒 ${updated}</span>
              </div>
              <a class="github-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository</a>
            </article>
          `;
        })
        .join('');

      if (!items) {
        fallback('No public repositories found yet.');
        return;
      }

      grid.innerHTML = items;
    })
    .catch(() => {
      fallback('Could not load GitHub repositories right now. Please try again later.');
    });
})();
