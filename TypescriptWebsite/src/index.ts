const getUsername = document.querySelector('#user') as HTMLInputElement;
const formSubmit = document.querySelector(".form") as HTMLFormElement;
const main_container = document.querySelector('.main') as HTMLElement;

//lets define the contract of an object
interface Userdata {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}

const myCustomFetcher = async<T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok status : ${response.status}`);

    }
    const data = await response.json();
    console.log(data);
    return data;
}
//let display the card UI
const showResultUI = (singleUser: Userdata) => {
    const { avatar_url, login, url, location } = singleUser;

    // Create a div element
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    // Create an image element
    const image = document.createElement('img');
    image.src = avatar_url;
    image.alt = login;

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.textContent = 'github';

    // Append the image and link elements to the cardDiv
    cardDiv.appendChild(image);
    cardDiv.appendChild(link);

    // Insert the cardDiv before the main_container
    main_container.insertAdjacentElement('beforebegin', cardDiv);
}



const fetchUserData = (url: string) => {
    myCustomFetcher<Userdata[]>(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
            console.log("login " + singleUser.login)
        }
    })

}

//defatult function call
fetchUserData("https://api.github.com/users");

//let perform search fun
formSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();

    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher<Userdata[]>(url, {});
        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);

        })

        main_container.innerHTML = "";
        if (matchingUsers.length === 0) {
            main_container?.insertAdjacentHTML(
                "beforebegin",
                `<p> No matching users found </p>`
            )
        }
    }
    catch (error) {
        console.log(error)
    }
})