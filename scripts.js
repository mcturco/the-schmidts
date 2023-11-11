let consoleLog = () => {
    console.log("hello world")
}

function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

let inviteeName = document.getElementById("invitee-name")

if (inviteeName) {
    sessionStorage.setItem("inviteeName", inviteeName.innerHTML)
    let name = htmlDecode(sessionStorage.getItem("inviteeName"))
    sessionStorage.setItem("inviteeName", name)

}

consoleLog()