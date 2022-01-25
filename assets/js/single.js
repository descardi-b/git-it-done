
var issuesContainer = document.querySelector("#issues-container");

var getRepoIssues = function(repo) {
    var apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;
    
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);
            });
        } else {
            alert("There was a problem with your request!");
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

getRepoIssues("facebook/react");