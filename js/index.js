//accessing dom element
const form = document.getElementById('form-search');
const search = document.getElementById('search');
const error = document.getElementById('error');
const errorMsg = document.getElementById('error-msg');
const errorBtn = document.getElementById('error-btn');
const searchBtn = document.getElementById('search-repo');

form.addEventListener('submit', getUser);
errorBtn.addEventListener('click', () => (error.style.display = 'none'));

const getUserQuery = (username) => `query {
    repositoryOwner(login: "${username}") {
    repositories(last: 20) {
      nodes {
        name
        url
        languages(first: 1) {
          nodes {
            color
            id
            name
          }
        }
        updatedAt
      }
      totalCount
    }
    ... on User {
      avatarUrl
      bio
      name
      status {
        user {
          followers {
            totalCount
          }
          following {
            totalCount
          }
          watching {
            totalCount
          }
          login
        }
      }
    }
  }
}`;

//set timeout of 10 seconds for api request
const Timeout = () => {
	let controller = new AbortController();
	setTimeout(() => controller.abort(), 10000);
	return controller;
};

//functions
function getUser(e) {
	e.preventDefault();

	searchBtn.innerText = 'Loading....';
	searchBtn.disabled = true;
	
	//hide error message on new request call
	error.style.display = 'none';

	const options = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization:
				'Bearer ' + '## API KEY',
		},

		body: JSON.stringify({
			query: getUserQuery(search.value),
		}),
		signal: Timeout().signal,
	};

	fetch('https://api.github.com/graphql', options)
		.then((resp) => resp.json())
		.then((resp) => {
			const result = resp.data.repositoryOwner;
			if (result !== null) {
				sessionStorage.setItem('result', JSON.stringify(result));
				window.location.href = 'profile.html';
			} else {
				sessionStorage.removeItem('result');
				error.style.display = 'flex';
				errorMsg.textContent =
					'Oop! Your search did not return a result. Try another username';
				searchBtn.innerText = 'search';
				searchBtn.disabled = false;
			}
		})
		.catch((e) => {
			error.style.display = 'flex';
			errorMsg.textContent =
				'Something went wrong! Please check your network or contact an admin';
			searchBtn.innerText = 'search';
			searchBtn.disabled = false;
		});
}
