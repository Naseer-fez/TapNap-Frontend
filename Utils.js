

function CookieExist(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    // if (parts.length === 2) return parts.pop().split(';').shift();
    return parts.length === 2;
};

async function CheckifAlreadyExist() {
    //  localStorage.setItem("Userid", id);
    //     localStorage.setItem("username",username)
    //     document.cookie = `Userid=${id}; ${expiry}; ${path}; ${sameSite}`;
    //     document.cookie = `username=${username}; ${expiry}; ${path}; ${sameSite}`;

    const item = "Userid";
    if (localStorage.getItem(item) || CookieExist(item)) {
        // return true;  //Exist  means u can continue
        console.log("HAHAHAH")
        // await new Promise(resolve => setTimeout(resolve, 2000));
        window.location.href = CONFIG["Redirect"]  // Redirect to Other page 
        return;
    }
    console.log("No user found. Staying on current page.");

};


const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};