let send = {
  nameCheck: false,
  name: "",
  loggingCheck: false,
  email: "",
  password: "",
  newMailCheck: false,
  newMail: "",
  newPasswordCheck: false,
  newPassword: "",
};
let data;
let uid = "";
document.addEventListener("DOMContentLoaded", () => {
  uid = document
    .getElementById("uid__section")
    .querySelector(".left").innerHTML;
  uid = uid.substring(5);
});
const sw = document.getElementById("switch");
sw.addEventListener("click", () => {
  const bal = document.querySelector(".bal");
  const dust = document.querySelector(".dust");

  if (dust.classList.contains("opa")) {
    bal.classList.add("opa");
    dust.classList.remove("opa");
  } else {
    bal.classList.remove("opa");
    dust.classList.add("opa");
  }
});
const change = document.getElementById("changeName");
change.addEventListener("click", () => {
  send.nameCheck = false;
  document.querySelector(".initial__state").classList.toggle("invisible");
  document.querySelector(".changed__state").classList.toggle("invisible");
});
const cancel = document.getElementById("cancel");
cancel.addEventListener("click", () => {
  send.nameCheck = false;
  document.querySelector(".initial__state").classList.toggle("invisible");
  document.querySelector(".changed__state").classList.toggle("invisible");
});

const confirm = document.getElementById("confirm");
confirm.addEventListener("click", () => {
  document.querySelector(".initial__state").classList.toggle("invisible");
  document.querySelector(".changed__state").classList.toggle("invisible");
  const newName = document.querySelector(".name__input");
  document.getElementById("nickname").innerHTML = newName.value;
  newName.placeholder = newName.value;
  document.querySelector(".initial__state .left").innerHTML = newName.value;
  send.name = newName.value;
  send.nameCheck = true;
  fetchData();
});

const overlay = document.getElementById("overlay");
const modelLogging = document.querySelector(".model__logging");
const modelMail = document.querySelector(".model__mail");
const modelPassword = document.querySelector(".model__password");
const modelImage = document.querySelector(".model__image");

const hide = document.getElementById("loggin__icon");
hide.addEventListener("click", () => {
  if (hide.className === "fa-regular fa-eye-slash hidden") {
    hide.className = "fa-regular fa-eye hidden";
    document.getElementById("password").type = "password";
  } else {
    hide.className = "fa-regular fa-eye-slash hidden";
    document.getElementById("password").type = "text";
  }
});

const hideNewPassword = document.getElementById("new__icon");
hideNewPassword.addEventListener("click", () => {
  if (hideNewPassword.className === "fa-regular fa-eye-slash hidden") {
    hideNewPassword.className = "fa-regular fa-eye hidden";
    document.getElementById("password__change").type = "password";
  } else {
    hideNewPassword.className = "fa-regular fa-eye-slash hidden";
    document.getElementById("password__change").type = "text";
  }
});

const hideNewPasswordRepeat = document.getElementById("repeat__icon");
hideNewPasswordRepeat.addEventListener("click", () => {
  if (hideNewPasswordRepeat.className === "fa-regular fa-eye-slash hidden") {
    hideNewPasswordRepeat.className = "fa-regular fa-eye hidden";
    document.getElementById("password__change__repeat").type = "password";
  } else {
    hideNewPasswordRepeat.className = "fa-regular fa-eye-slash hidden";
    document.getElementById("password__change__repeat").type = "text";
  }
});

const close = document.querySelector(".model__close");
close.addEventListener("click", () => {
  overlay.classList.toggle("active");
  modelLogging.classList.toggle("active");
  clear();
});

const mailChange = document.getElementById("mailChange");
mailChange.addEventListener("click", () => {
  overlay.classList.toggle("active");
  modelLogging.classList.toggle("active");
  document.getElementById("confirmLoggin").classList.remove("confirm__hidden");
  document
    .getElementById("confirmLogginPassword")
    .classList.add("confirm__hidden");
  clear();
});

const confirmLoggin = document.getElementById("confirmLoggin");
confirmLoggin.addEventListener("click", async () => {
  send.nameCheck = false;
  send.loggingCheck = true;
  send.email = document.getElementById("mail").value;
  send.password = document.getElementById("password").value;
  await fetchData();
  console.log(data);
  if (data === true) {
    modelLogging.classList.toggle("active");
    modelMail.classList.toggle("active");
    clear();
  } else {
    alert("wrong credentials");
  }
});

const confirmLogginPassword = document.getElementById("confirmLogginPassword");
confirmLogginPassword.addEventListener("click", async () => {
  send.nameCheck = false;
  send.loggingCheck = true;
  send.email = document.getElementById("mail").value;
  send.password = document.getElementById("password").value;
  await fetchData();
  console.log(data);
  if (data === true) {
    modelLogging.classList.toggle("active");
    modelPassword.classList.toggle("active");
    clear();
  } else {
    alert("wrong credentials");
  }
});

const closeMail = document.querySelector(".model__close__mail");
closeMail.addEventListener("click", () => {
  overlay.classList.toggle("active");
  modelMail.classList.toggle("active");
  clear();
});

const closePassword = document.getElementById("close__password");
closePassword.addEventListener("click", () => {
  overlay.classList.toggle("active");
  modelPassword.classList.toggle("active");
  clear();
});

const closeImage = document.getElementById("close__picture");
closeImage.addEventListener("click", () => {
  overlay.classList.toggle("active");
  modelImage.classList.toggle("active");
  clear();
});

const confirmMail = document.getElementById("confirmMail");
confirmMail.addEventListener("click", async () => {
  const mail = document.getElementById("email");
  const mailRepeat = document.getElementById("email__repeat");
  const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (
    mail.value === mailRepeat.value &&
    emailPattern.test(mail.value) &&
    emailPattern.test(mailRepeat.value)
  ) {
    send.loggingCheck = false;
    send.newMailCheck = true;
    send.newMail = mail.value;
    await fetchData();
    if (data === true) {
      document.getElementById("page__mail").innerHTML = mail.value;
      clear();
      overlay.classList.toggle("active");
      modelMail.classList.toggle("active");
    } else {
      clear();
      alert("email already in use");
    }
  } else {
    alert("false");
    clear();
  }
});

const passwordChange = document.getElementById("passwordChange");
passwordChange.addEventListener("click", () => {
  overlay.classList.toggle("active");
  modelLogging.classList.toggle("active");
  document.getElementById("confirmLoggin").classList.add("confirm__hidden");
  document
    .getElementById("confirmLogginPassword")
    .classList.remove("confirm__hidden");
  clear();
});

const confirmPassword = document.getElementById("confirmPassword");
confirmPassword.addEventListener("click", async () => {
  const pass = document.getElementById("password__change");
  const passRepeat = document.getElementById("password__change__repeat");

  if (pass.value === passRepeat.value) {
    send.loggingCheck = false;
    send.newMailCheck = false;
    send.newPasswordCheck = true;
    send.newPassword = pass.value;
    await fetchData();
    clear();
    overlay.classList.toggle("active");
    modelPassword.classList.toggle("active");
  } else {
    alert("Please enter matching passwords");
  }
});

const profileChange = document.querySelector(".profile__img");
profileChange.addEventListener("click", () => {
  modelImage.classList.toggle("active");
  overlay.classList.toggle("active");
});

const inputFile = document.getElementById("newPicture");
const selectedImage = document.getElementById("selectedImage");
inputFile.onchange = async () => {
  let selectedFile = inputFile.files[0];
  const fileSize = inputFile.files[0].size;
  const fileLimit = 6;
  const fileSizeInMega = fileSize / (1024 * 1024);
  if (fileSizeInMega > fileLimit) {
    alert("Image is too large");
  } else {
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileName = selectedFile.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert("wrong file format");
    } else {
      let formData = new FormData();
      formData.append("inputFile", inputFile.files[0]);
      console.log(formData);
      await fetch("http://localhost:3000/upload/?", {
        method: "POST",
        body: formData,
      }).then(() => {
        overlay.classList.toggle("active");
        modelImage.classList.toggle("active");
        const imageURL = URL.createObjectURL(selectedFile);
        document.querySelector(".pfp").setAttribute("src", imageURL);
        document
          .querySelector(".avatar__rounded")
          .setAttribute("src", imageURL);
        clear();
      });
    }
  }
};

async function clear() {
  document.getElementById("email").value = "";
  document.getElementById("email__repeat").value = "";
  document.getElementById("password").value = "";
  document.getElementById("password__change").value = "";
  document.getElementById("password__change__repeat").value = "";
}

async function fetchData() {
  const response = await fetch("http://localhost:3000/settings/?", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: send,
    }),
  });
  data = await response.json();
}
