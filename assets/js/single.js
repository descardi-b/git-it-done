var limitWarningEl = document.querySelector("#limit-warning");
var issuesContainer = document.querySelector("#issues-container");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if(repoName) {
        // display repo name on page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
      } else {
        // if no repo is given, redirect to index
        document.location.replace("./index.html");
      };
  };

var getRepoIssues = function(repo) {
    var apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);
                if (response.headers.get("Link")) {
                   displayWarning(repo);
                }
            });
        } else {
            // if unsuccessful, redirect
            document.location.replace("./index.html");
        }
    })
};

var displayIssues = function(issues) {
    // if there are no open issues
    if (issues.length === 0) {
        issuesContainer.textContent = "This repo has no open issues!";
        return;
    }
    for (i = 0; i < issues.length; i++) {
        // create a link element to take users to issue
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create a span to hold the issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append the title to the container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if the issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to the issue element
        issueEl.appendChild(typeEl);

        // append to the entire container
        issuesContainer.appendChild(issueEl);
    }
}

var displayWarning = function(repo) {
    // add text to the warning container
    limitWarningEl.textContent = `To see more than 30 issues, please visit `
    var linkEl = document.createElement("a");
    linkEl.textContent = "Repository Issues on GitHub.com";
    linkEl.setAttribute("href", `https://github.com/${repo}/issues`);
    linkEl.setAttribute("target", "_blank");

    // append to the warning container
    limitWarningEl.appendChild(linkEl);
}

getRepoIssues();

getRepoName();