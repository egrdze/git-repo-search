const searchInput = document.getElementById('search');
const autocompleteBox = document.getElementById('autocomplete');
const repoList = document.getElementById('repoList');

let debounceTimer;

function debounce(fn, delay) {
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn.apply(this, args), delay);
  };
}

async function fetchRepos(query) {
  if (!query) {
    autocompleteBox.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`);
    const data = await response.json();
    renderAutocomplete(data.items);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

function renderAutocomplete(repos) {
  repos.forEach(repo => {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.textContent = repo.name;
    item.addEventListener('click', () => {
      addRepoToList(repo);
      autocompleteBox.innerHTML = '';
      searchInput.value = '';
    });
    autocompleteBox.appendChild(item);
  });
}

function addRepoToList(repo) {
  const container = document.createElement('div');
  container.className = 'repo';
  container.innerHTML = `
    Name:${repo.name}<br>
    Owner: ${repo.owner.login}<br>
    Stars: ${repo.stargazers_count}
    <span class="remove-btn">X</span>`;
  container.querySelector('.remove-btn').addEventListener('click', () => container.remove());
  repoList.appendChild(container);
}

searchInput.addEventListener('input', debounce((e) => {
  fetchRepos(e.target.value);
}, 500));