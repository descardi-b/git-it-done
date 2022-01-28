// form variable
var userFormEl = document.querySelector("#user-form");
// input variable
var nameInputEl = document.querySelector("#username");
// repo search term variable
var repoSearchTerm = document.querySelector("#repo-search-term");
// repo container variable
var repoContainerEl = document.querySelector("#repos-container");
// language button variable
var languageButtonsEl = document.querySelector("div #language-buttons");

// form submission function

var formSubmitHandler = function (event) {
    event.preventDefault();
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username.")
    }
    console.log(event);
};

var getUserRepos = function (username) {
    // format the github api url
    var apiURL = `https://api.github.com/users/${username}/repos`

    // make a request to the url

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data, username);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
        .catch(function (error) {
            // notice that ".catch" is getting chained
            // to the end of the ".then" method
            alert("Unable to connect to GitHub");
        });
};

userFormEl.addEventListener("submit", formSubmitHandler);

// display repos on the page
var displayRepos = function (repos, searchTerm) {
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = `${repos[i].owner.login}/${repos[i].name}`;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository names
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append the title to the repo div
        repoEl.appendChild(titleEl);

        // append the repo div to the dom
        repoContainerEl.appendChild(repoEl);

        // create status element
        statusEl = document.createElement("span");

        // check if current repo has open issues
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = `<i class='fas fa-times status-icon icon-danger'></i>${repos[i].open_issues_count} issue(s)`;
        } else {
            statusEl.innerHTML = `<i class='fas fa-check-square status-icon icon-success'></i>`;
        }

        // append status element to the container
        repoEl.appendChild(statusEl);
    }
}

var getFeaturedRepos = function (language) {
    var apiURL = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data.items, language);
            });
        } else {
            alert('Error: GitHub User Not Found');
        }
    });
};

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    console.log(language);
    if (language) {
        getFeaturedRepos(language);
        // clear old contents
        repoContainerEl.textContent = "";
    }
}

languageButtonsEl.addEventListener("click", buttonClickHandler);