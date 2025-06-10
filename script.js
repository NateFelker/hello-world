async function loadData() {
    const response = await fetch('data.json');
    const data = await response.json();
    renderIssues(data.issues);
}

function renderIssues(issues) {
    const container = document.getElementById('issues-container');
    issues.sort((a, b) => a.rank - b.rank);
    issues.forEach(issue => {
        const issueDiv = document.createElement('div');
        issueDiv.className = 'issue';
        const title = document.createElement('h2');
        title.textContent = `${issue.rank}. ${issue.name}`;
        issueDiv.appendChild(title);

        const canvas = document.createElement('canvas');
        canvas.className = 'trend';
        issueDiv.appendChild(canvas);
        drawTrend(canvas, issue.trend);

        const orgList = document.createElement('ul');
        orgList.className = 'organizations';
        issue.organizations.forEach(org => {
            const li = document.createElement('li');
            li.className = 'organization';
            const link = document.createElement('a');
            link.href = org.website;
            link.textContent = org.name;
            link.target = '_blank';
            li.appendChild(link);
            const upvote = document.createElement('button');
            upvote.className = 'upvote';
            upvote.textContent = `\u2b06 ${getVotes(org.name)}`;
            upvote.addEventListener('click', () => {
                incrementVote(org.name);
                upvote.textContent = `\u2b06 ${getVotes(org.name)}`;
            });
            li.appendChild(upvote);
            orgList.appendChild(li);
        });
        issueDiv.appendChild(orgList);
        container.appendChild(issueDiv);
    });
}

function drawTrend(canvas, data) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const padding = 5;
    ctx.strokeStyle = '#008cba';
    ctx.beginPath();
    data.forEach((value, idx) => {
        const x = padding + (w - 2 * padding) * (idx / (data.length - 1));
        const y = h - padding - (h - 2 * padding) * ((value - min) / (max - min || 1));
        if (idx === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
}

function getVotes(name) {
    return parseInt(localStorage.getItem(`votes_${name}`)) || 0;
}

function incrementVote(name) {
    const key = `votes_${name}`;
    const current = getVotes(name);
    localStorage.setItem(key, current + 1);
}

loadData();
