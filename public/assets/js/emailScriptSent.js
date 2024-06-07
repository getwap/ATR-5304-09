// /* Email.js: Dropdown selections */
function updateButton(emailDropdown, buttonId) {
  const button = document.getElementById(buttonId);
  button.textContent = emailDropdown;

  // Update the dropdown in the modal
  const modalDropdown = document.querySelector("#composemodal .form-select");
  modalDropdown.innerHTML = "";
  const newOption = document.createElement("option");
  newOption.textContent = emailDropdown;
  newOption.value = emailDropdown;
  newOption.selected = true;
  modalDropdown.appendChild(newOption);
}

function fetchSentEmails() {
  fetch("/inbox/sent-emails")
    .then((response) => response.json()) // Parse JSON response
    .then((data) => {
      if (data.success) {
        displayEmails(data.emails); // Call display function with fetched emails
      } else {
        console.error("Error: ", data.error);
      }
    })
    .catch((error) => console.error("Error loading sent emails:", error));
}

function displayEmails(emails) {
  const emailList = document.getElementById("mail-list");
  emailList.innerHTML = ""; // Clear previous emails
  emails.forEach((email) => {
    const emailItem = document.createElement("div");
    emailItem.style.marginBottom = "1em";
    emailItem.style.border = "1px solid #ccc";
    emailItem.style.borderRadius = "5px";

    emailItem.innerHTML = `
      <div class="accordion-header" style="background: #f1f1f1; padding: 1em; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
  <div style="flex-grow: 1;">
    <div style="color:#000000">
      <strong style="color:#000000">To:</strong> ${email.emailTo}
    </div>
    <div style="margin-top: 0.5em;display:flex;flexDirection:column;color:#000000">
      <strong style="color:#000000"> ${email.emailSubject}</strong>----
  <strong style="color:#000000">
      ${email.emailMessage.slice(0, 30)}...
      </strong>
    </div>
  </div>
  <div style="margin-left: 1em; white-space: nowrap;color:#000000;">
    ${new Date(email.sentOn).toLocaleString()}
  </div>
</div>


        <div class="accordion-body" style="display: none; padding: 1em; background: #fff; border-top: 1px solid #ccc;">
          <p style="color:#000000"><strong>From:</strong> ${email.emailFrom}</p>
          <p style="color:#000000"><><strong>To:</strong> ${email.emailTo}</p>
          <p style="color:#000000"><><strong>Subject:</strong> ${
            email.emailSubject
          }</p>
          <p style="color:#000000"><><strong>Message:</strong> ${
            email.emailMessage
          }</p>
          <p style="color:#000000"><><strong>Sent On:</strong> ${new Date(
            email.sentOn
          ).toLocaleString()}</p>
        </div>
      `;
    emailList.appendChild(emailItem);

    // Add event listener to toggle accordion
    const header = emailItem.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      header.classList.toggle("active");
      const body = header.nextElementSibling;
      if (body.style.display === "block") {
        body.style.display = "none";
      } else {
        body.style.display = "block";
      }
    });
  });
}

// Call fetchSentEmails function to initiate fetching process
fetchSentEmails();
//   <!-- Temperary script, setup server side storage later so the app auto defaults to the last emails selected. -->
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("personalDropdownButton");
  // Default email
  const defaultEmail = "smendoza864@gmail.com"; // Set your default email
  const savedEmail = localStorage.getItem("selectedEmail") || defaultEmail;
  button.textContent = savedEmail;
});

let editor;
ClassicEditor.create(document.querySelector("#emailEditor"))
  .then((emailEditor) => {
    editor = emailEditor;
    // console.log('Editor was initialized');
  })
  .catch((error) => {
    console.error("Problem initializing the editor.", error);
  });

function sendEmail() {
  // Close the modal immediately
  var emailModel = document.getElementById("composemodal");
  var modal = bootstrap.Modal.getInstance(emailModel); // Get the modal instance
  if (modal) {
    modal.hide();
  } else {
    // Fallback: Hide the modal by directly manipulating styles if the instance isn't found
    emailModel.style.display = "none";
    document.querySelector(".modal-backdrop").remove(); // This removes the backdrop
  }

  // Show the processing loader
  document.getElementById("processingLoader").style.display = "block";
  const ccRecipients = document.getElementById("Ccrecipients")?.value || "";
  const bbRecipients = document.getElementById("Bbrecipients")?.value || "";
  console.log("ccRecipients", ccRecipients);
  console.log("bbrecipients", bbRecipients);
  document.getElementById("alert").style.display = "block";

  // Proceed with sending the email
  fetch("/inbox/sendEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: document.getElementById("emailFrom").value,
      to: document.getElementById("emailTo").value,
      subject: document.getElementById("emailSubject").value,
      ccRecipients: document.getElementById("Ccrecipients").value,
      bbRecipients: document.getElementById("Bbrecipients").value,
      body: editor.getData(),
    }),
  })
    .then((response) => {
      // response.json();
      console.log("response", response);
      document.getElementById("processingLoader").style.display = "none";
      document.getElementById("alert").style.display = "none";

      if (response?.status === 200) {
        console.log("response?.success", response?.success);
        // console.log("Success:", data);
        // Reset the form and clear the editor
        document.getElementById("emailForm").reset();
        editor.setData("");

        document.getElementById("toast").style.display = "block";

        // Remove the show class after 3 seconds to hide the toast
        setTimeout(() => {
          document.getElementById("toast").style.display = "none";
        }, 3000);

        // Show the success alert
        document.getElementById("emailSentAlert").style.display = "block";
        setTimeout(function () {
          document.getElementById("emailSentAlert").style.display = "none"; // Show alter for 5 seconds
        }, 5000);
      } else {
        document.getElementById("errorFound").style.display = "block";

        setTimeout(function () {
          document.getElementById("errorFound").style.display = "none"; // Show alter for 5 seconds
        }, 5000);
        // console.error("Failed to send email:", data.error);
        // showErrorToast("Failed to send email: " + data.error);
        console.error("Failed to send email:");
        showErrorToast("Failed to send email: ");
        // if (
        //   data.error.includes(
        //     "Invalid login: 535 Incorrect authentication data"
        //   )
        // ) {
        //   document.getElementById("emailCredentialsAlert").style.display =
        //     "block";
        //   setTimeout(function () {
        //     document.getElementById("emailCredentialsAlert").style.display =
        //       "none"; // Show alter for 5 seconds
        //   }, 5000);
        // }
      }
    })
    // .then((data) => {
    //   // Hide the loader when the request completes
    //   document.getElementById("processingLoader").style.display = "none";

    //   if (data.success) {
    //     console.log("Success:", data);
    //     // Reset the form and clear the editor
    //     document.getElementById("emailForm").reset();
    //     editor.setData("");

    //     // Show the success alert
    //     document.getElementById("emailSentAlert").style.display = "block";
    //     setTimeout(function () {
    //       document.getElementById("emailSentAlert").style.display = "none"; // Show alter for 5 seconds
    //     }, 5000);
    //   } else {
    //     console.error("Failed to send email:", data.error);
    //     showErrorToast("Failed to send email: " + data.error);

    //     if (
    //       data.error.includes(
    //         "Invalid login: 535 Incorrect authentication data"
    //       )
    //     ) {
    //       document.getElementById("emailCredentialsAlert").style.display =
    //         "block";
    //       setTimeout(function () {
    //         document.getElementById("emailCredentialsAlert").style.display =
    //           "none"; // Show alter for 5 seconds
    //       }, 5000);
    //     }
    //   }
    // })
    .catch((error) => {
      document.getElementById("alert").style.display = "none";
      document.getElementById("errorFound").style.display = "block";
      setTimeout(function () {
        document.getElementById("errorFound").style.display = "none"; // Show alter for 5 seconds
      }, 5000);
      // Hide the loader when an error occurs
      document.getElementById("processingLoader").style.display = "none";
      console.error("Error:", error);
      showErrorToast("Error sending email: " + error.message);
    });
}

// Additional helper functions for toasts
function showErrorToast(message) {
  let toast = document.getElementById("errorToast");
  toast.querySelector(".toast-body").textContent = message;
  new bootstrap.Toast(toast).show();
}

// ******************** Email data displays ******************** //
