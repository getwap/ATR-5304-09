const newCopyIcon = feather.icons.copy.toSvg();
const parser = new DOMParser();
const svgDoc = parser.parseFromString(newCopyIcon, 'text/html');
const svgElement = svgDoc.querySelector('svg');

svgElement.setAttribute('width', '14');
svgElement.setAttribute('height', '14');

const copyIcon = svgElement.outerHTML;

let passEyeIconClass = 'ri-eye-fill'; 
let tableVault = document.getElementById('table-vault');
tableVault.innerHTML = ''; 

let grid = '';
let gridColumn = [
  {
    id: 'checkbox',
    name: '',
    width: '35px',
    formatter: (cell, row) => {
      return gridjs.html(`
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="checkItem" value="${row.cells[0].data}">
        </div>    
      `);
    }
  },
  {
    id: 'site',
    name: 'Site',
    formatter: (cell) => {
      return gridjs.html(`<a href="${cell}" target="_blank">${formatMTMText(removeURLPrefix(cell), null, 27, 24)}</a>`);
    },
  },
  {
    id: 'for',
    name: 'For',
    formatter: (cell) => {
      const vaultForValues = Array.isArray(cell) ? cell : [cell];
      const backgroundColors = ['bg-info', 'bg-primary', 'bg-warning', 'bg-danger', 'bg-success', 'bg-secondary'];
      const otherOptions = ['Personal', 'Enterpriselux', 'Vapor Edge', "Mendoza's Precious Metals", 'White Nirvana'];
  
      let avatarHtml;
  
      if (vaultForValues.length === 1 && vaultForValues[0] === 'All Businesses') {
        avatarHtml = otherOptions.map((option, index) => {
          const backgroundColor = backgroundColors[index % backgroundColors.length];
          const firstCharacter = option.trim().charAt(0);
          return `
            <div class="avatar-group-item">
              <a href="javascript: void(0);">
                <div class="avatar-xxs">
                  <span class="avatar-title rounded-circle ${backgroundColor} text-white">${firstCharacter}</span>
                </div>
              </a>
            </div>
          `;
        }).join('');
      } else {
        avatarHtml = vaultForValues
          .filter(value => value !== 'All Businesses')
          .map((value, index) => {
            const backgroundColor = backgroundColors[index % backgroundColors.length];
            const firstCharacter = typeof value === 'string' ? value.trim().charAt(0) : value;
            return `
              <div class="avatar-group-item">
                <a href="javascript: void(0);">
                  <div class="avatar-xxs">
                    <span class="avatar-title rounded-circle ${backgroundColor} text-white">${firstCharacter}</span>
                  </div>
                </a>
              </div>
            `;
          })
          .join('');
      }
  
      return gridjs.html(`
        <div class="col-sm-auto">
          <div class="avatar-group">
            ${avatarHtml}
          </div>
        </div>
      `);
    },
  },
  {
    id: 'username',
    name: 'Username',
    formatter: (cell) => {
      return gridjs.html(`
        <span class="vault-table-username">${cell}</span>
        <i onclick="copyVaultLoginUsername('${cell}', event)" class="vault-table-copy text-muted">${copyIcon}</i>
      `)
    },
  },
  {
    id: 'email',
    name: 'Email',
    formatter: (cell) => {
      return gridjs.html(`
        <span class="vault-table-username">${cell}</span>
        <i onclick="copyVaultLoginEmail('${cell}', event)" class="vault-table-copy text-muted">${copyIcon}</i>
      `)
    },
  },
  {
    id: 'password',
    name: 'Password',
    width: '140px',
    formatter: (cell, row) => {
      const password = row.cells[5].data;

      return gridjs.html(`<div>
        <span class="vaultPassText" data-password="${password}">************</span>
        <i onclick="copyVaultLoginPassword('${password}', event)" class="vault-table-copy text-muted">${copyIcon}</i>
        <i onclick="showVaultPassword('${password}', event)" class="${passEyeIconClass} align-middle vault-table-eye-icon text-muted"></i>
      </div>`);
    },
  },
  {
    id: 'lastUsedBy',
    name: 'Last used by',
    formatter: (cell) => cell,
  },
  {
    id: 'lastUsedOn',
    name: 'Last used on',
    formatter: (cell) => cell,
  },
  {
    id: 'actions',
    name: 'Actions',
    formatter: (cell, row) => {
      return gridjs.html(`<div class="d-flex gap-2">
                            <div class="dropdown">
                              <a href="#" role="button" id="dropdownMenuLink_${row.cells[0].data}" data-bs-toggle="dropdown" aria-expanded="false" style="padding: 0px 7px;">
                                <i class="ri-more-2-fill"></i>
                              </a>
                              <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink_${row.cells[0].data}">
                                <!--<li><a class="dropdown-item" onclick="Details('${row.cells[0].data}');" href="#">Details</a></li>-->
                                <li><a class="dropdown-item" onclick="Edit('${row.cells[0].data}');" href="#">Edit</a></li>
                                <li><a class="dropdown-item" href="#">Share</a></li>
                                <li><a class="dropdown-item" onclick="Delete('${row.cells[0].data}');" href="#">Delete</a></li>
                              </ul>
                            </div>
                          </div>`);
    },
  }
];

// Function to show the grid table
function showGrid(data){
  let gridData = [];
  if(data !== null || data != undefined){
    gridData = data.map(item => [
      item._id,
      item.url,
      item.vaultFor,
      item.username ? formatMTMText(item.username, null, 24, 21) : '',
      item.email ? formatMTMText(item.email, null, 24, 21) : '',
      item.password,
      item.lastUsedBy ? formatMTMText(item.lastUsedBy, null, 27, 24) : '',
      item.lastUsedOn ? formatDate(item.lastUsedOn) : '',
      item._id,
      item.createdOn
    ]);
  }

  // sort grid data by createdOn date
  gridData.sort((a, b) => new Date(b[9]) - new Date(a[9]));

  grid = new gridjs.Grid({
    columns: gridColumn,
    pagination: {
      limit: 10
    },
    //search: true,
    data: gridData,
  }).render(document.getElementById("table-vault"));
}

function addCheckAllBox(){
  const tableHeader = document.querySelector('th[data-column-id="checkbox"]');

  if (tableHeader) {
    const gridjsThContent = tableHeader.querySelector('.gridjs-th-content');
    
    if (gridjsThContent) {
      const checkboxDiv = document.createElement('div');
      checkboxDiv.classList.add('form-check');

      const checkboxInput = document.createElement('input');
      checkboxInput.classList.add('form-check-input');
      checkboxInput.setAttribute('type', 'checkbox');
      checkboxInput.setAttribute('id', 'checkAll');
      checkboxInput.setAttribute('value', false);
      checkboxInput.checked = false; 

      checkboxInput.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('#checkItem');
        checkboxes.forEach(checkbox => {
          checkbox.checked = this.checked;
        });
      });

      checkboxDiv.appendChild(checkboxInput);
      gridjsThContent.appendChild(checkboxDiv);
    }
  }
}

function showVaultPassword(password, event) {
  event.stopPropagation();

  const vaultPassText = event.target.closest('tr').querySelector('.vaultPassText');

  if (vaultPassText) {
    if (vaultPassText.textContent === '************') {
      const formattedPassword = password !== null ? formatMTMText(password, null, 10, 7) : '';
      //passEyeIconClass = 'ri-eye-off-fill';
      vaultPassText.textContent = formattedPassword;
      const tooltip = document.getElementById('vault-tooltip');

      if (tooltip) {
        tooltip.textContent = password;
        showTooltip(tooltip, event);
      } 

    } else {
      passEyeIconClass = 'ri-eye-fill';
      vaultPassText.textContent = '************';
    }
  }
}

function copyFromInputFields(field, event){
  switch (field) {
    case 'Username':
      const cpEditUsername = document.getElementById('vaultEditUsername').value;
      copyVaultLoginUsername(cpEditUsername, event);
      break;

    case 'Email':
      const cpEditEmail = document.getElementById('vaultEditEmail').value;
      copyVaultLoginEmail(cpEditEmail, event);
      break;

    case 'Password':
      const cpEditPassword = document.getElementById('vaultEditPassword').value;
      copyVaultLoginPassword(cpEditPassword, event);
      break;

    default:
      break;
  }
}

function copyVaultLoginUsername(username, event) {
  const textToCopy = username;
  const tooltip = document.getElementById('vault-tooltip');
  let rowId = null;
  const row = event.target.closest('tr');
  if(row){
    rowId = row.querySelector('input[id="checkItem"]').value;
  } else {
    const vaultEditId = document.getElementById('vaultEditId');
    if(vaultEditId){
      rowId = vaultEditId.value;
    }
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        if (tooltip) {
          tooltip.textContent = 'Username Copied!';
          showTooltip(tooltip, event);
        }
        updateVaultLoginUsage(rowId);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  } else {
    // Fallback for older browsers
    const textField = document.createElement('textarea');
    textField.innerText = textToCopy;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    if (tooltip) {
      tooltip.textContent = 'Username Copied!';
      setTimeout(() => {
        tooltip.textContent = '';
      }, 1000);
    }
    updateVaultLoginUsage(rowId);
  }
}

function copyVaultLoginEmail(email, event) {
  const textToCopy = email;
  const tooltip = document.getElementById('vault-tooltip');
  let rowId = null;
  const row = event.target.closest('tr');
  if(row){
    rowId = row.querySelector('input[id="checkItem"]').value;
  } else {
    const vaultEditId = document.getElementById('vaultEditId');
    if(vaultEditId){
      rowId = vaultEditId.value;
    }
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        if (tooltip) {
          tooltip.textContent = 'Email Copied!';
          showTooltip(tooltip, event);
        }
        updateVaultLoginUsage(rowId);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  } else {
    // Fallback for older browsers
    const textField = document.createElement('textarea');
    textField.innerText = textToCopy;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    if (tooltip) {
      tooltip.textContent = 'Email Copied!';
      setTimeout(() => {
        tooltip.textContent = '';
      }, 1000);
    }
    updateVaultLoginUsage(rowId);
  }
}

function copyVaultLoginPassword(password, event) {
  const textToCopy = password;
  const tooltip = document.getElementById('vault-tooltip');
  let rowId = null;
  const row = event.target.closest('tr');
  if(row){
    rowId = row.querySelector('input[id="checkItem"]').value;
  } else {
    const vaultEditId = document.getElementById('vaultEditId');
    if(vaultEditId){
      rowId = vaultEditId.value;
    }
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        if (tooltip) {
          tooltip.textContent = 'Password Copied!';
          showTooltip(tooltip, event);
        }
        updateVaultLoginUsage(rowId);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  } else {
    // Fallback for older browsers
    const textField = document.createElement('textarea');
    textField.innerText = textToCopy;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    if (tooltip) {
      tooltip.textContent = 'Copied!';
      setTimeout(() => {
        tooltip.textContent = '';
      }, 1000);
    }

    updateVaultLoginUsage(rowId);
  }
}

function showTooltip(tooltip, event) {
  const rect = event.target.getBoundingClientRect();
  tooltip.style.display = 'block';
  tooltip.style.position = 'fixed';
  tooltip.style.left = `${rect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.top - rect.height}px`;
  tooltip.style.opacity = 1;

  setTimeout(() => {
    tooltip.style.opacity = 0;
    setTimeout(() => {
      tooltip.style.display = 'none'; 
    }, 300); 
  }, 1000);
}

function Details(id) {
  console.log('Details', id);
  const vaultDetailsModal = document.getElementById('vaultDetailsModal');
  const modal = new bootstrap.Modal(vaultDetailsModal, {
    keyboard: false
  });

  if(modal){
    const selectedItem = data.find(item => item._id === id);
    console.log(selectedItem);

    if(selectedItem){
      const detailsUrl = document.getElementById('detailsUrl');
      const detailsFor = document.getElementById('detailsFor');
      const detailsUsername = document.getElementById('detailsUsername');
      const detailsPassword = document.getElementById('detailsPassword');
      const detailsPin = document.getElementById('detailsPin');
      const detailsLastUsedOn = document.getElementById('detailsLastUsedOn');
      const detailsLastUsedBy = document.getElementById('detailsLastUsedBy');

      detailsUrl.textContent = selectedItem.url;
      detailsUrl.href = selectedItem.url;
      detailsFor.textContent = selectedItem.vaultFor;
      detailsUsername.textContent = selectedItem.username;
      detailsPassword.textContent = selectedItem.password;
      detailsPin.textContent = selectedItem.pin;
      detailsLastUsedOn.textContent = selectedItem.lastUsedOn;
      detailsLastUsedBy.textContent = selectedItem.lastUsedBy;
    }

    modal.show();
  }
}

function Edit(id) {
  console.log('Edit', id);
  document.getElementById("editVaultModalForm").reset();
  const editVaultModal = document.getElementById('editVaultModal');
  const modal = new bootstrap.Modal(editVaultModal, {
    keyboard: false
  });

  if (modal) {
    const selectedItem = data.find(item => item._id === id);
    console.log("Selected Item: ", selectedItem);

    if (selectedItem) {
      document.getElementById('vaultEditId').value = selectedItem._id;
      document.getElementById('vaultEditSiteDescription').value = selectedItem.siteDescription || '';
      document.getElementById('vaultEditSiteUrl').value = selectedItem.url || '';
      document.getElementById('vaultEditUniqueUrl').value = selectedItem.uniqueUrl || '';
      document.getElementById('vaultEditUsername').value = selectedItem.username || '';
      document.getElementById('vaultEditUniqueId').value = selectedItem.uniqueId || '';
      document.getElementById('vaultEditEmail').value = selectedItem.email || '';
      document.getElementById('vaultEditPassword').value = selectedItem.password || '';
      document.getElementById('vaultEditLoginPin').value = selectedItem.pin || '';
      document.getElementById('vaultEditLoginNotes').value = selectedItem.notes || '';
      document.getElementById('vaultEditLoginCode').value = selectedItem.code || '';

      document.getElementById('vaultSiteEditOption1').checked = selectedItem.vaultFor.includes("Personal");
      document.getElementById('vaultSiteEditOption2').checked = selectedItem.vaultFor.includes("Enterpriselux");
      document.getElementById('vaultSiteEditOption3').checked = selectedItem.vaultFor.includes("Vapor Edge");
      document.getElementById('vaultSiteEditOption4').checked = selectedItem.vaultFor.includes("All Businesses");
      document.getElementById('vaultSiteEditOption5').checked = selectedItem.vaultFor.includes("Mendoza's Precious Metals");
      document.getElementById('vaultSiteEditOption6').checked = selectedItem.vaultFor.includes("White Nirvana");
    
      handleAllBusinessesCheckbox();
    
    }

    modal.show();
  }
}

function handleAllBusinessesCheckbox() {
  const allBusinessesCheckbox = document.getElementById('vaultSiteEditOption4');
  const otherCheckboxes = [
    document.getElementById('vaultSiteEditOption1'),
    document.getElementById('vaultSiteEditOption2'),
    document.getElementById('vaultSiteEditOption3'),
    document.getElementById('vaultSiteEditOption5'),
    document.getElementById('vaultSiteEditOption6')
  ];

  if (allBusinessesCheckbox.checked) {
    otherCheckboxes.forEach(checkbox => checkbox.checked = true);
  }

  allBusinessesCheckbox.addEventListener('change', function() {
    if (this.checked) {
      otherCheckboxes.forEach(checkbox => checkbox.checked = true);
    } else {
      otherCheckboxes.forEach(checkbox => checkbox.checked = false);
    }
  });
}

function Delete(id){
  console.log('Delete', id);
  const deleteVaultModal = document.getElementById('deleteVaultModal');
  const modal = new bootstrap.Modal(deleteVaultModal, {
    keyboard: false
  });

  if (modal) {
    const deleteVaultId = document.getElementById('deleteVaultId');

    if (deleteVaultId) {
      deleteVaultId.value = id;
    }

    modal.show();
  }
}

function bulkDelete() {
  const checkedItems = Array.from(document.querySelectorAll('input[id="checkItem"]:checked'))
    .map(checkbox => checkbox.value);

  if (checkedItems.length === 0) {
    showSweetAlert('Warning', 'Please select at least one item to delete.', 'warning', 'OK');
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete ${checkedItems.length} login(s). This action cannot be undone.`,
    iconHtml: '<lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#405189,secondary:#f06548" style="width:90px;height:90px; border: none; outline: none;"></lord-icon>',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: '<i class="ri-close-line me-1 align-middle"></i> Cancel',
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-link link-success text-decoration-none',
      loader: 'no-loader'
    },
    loaderHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>',
    buttonsStyling: false,
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      const requestData = {
        ids: checkedItems
      };

      var xhr = new XMLHttpRequest();
      xhr.open("DELETE", "/bulk-delete-vault-logins", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            var responseData = JSON.parse(xhr.responseText);
            console.log("Response data:", responseData);
            showSweetAlert('Success', responseData.message, 'success', 'OK');
            getAllVaultLogins();
          } catch (error) {
            console.error("Error parsing JSON response:", error);
            showSweetAlert('Error', 'Error parsing server response', 'error', 'OK');
          }
        } else {
          const response = JSON.parse(xhr.responseText);
          console.error(response.error);
          showSweetAlert('Error', response.error, 'error', 'OK');
        }
      };
      xhr.onerror = function() {
        console.error("Network error occurred");
        showSweetAlert('Network Error', 'Network error occurred. Please try again.', 'error', 'OK');
      };
      xhr.send(JSON.stringify(requestData));
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {

  document.getElementById("save-clear-btn").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("saveVaultLoginForm").reset();
  });

  document.getElementById("edit-clear-btn").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("editVaultModalForm").reset();
  });

  // Add event listener for the save button for the vault login form
  document.getElementById("save-btn").addEventListener("click", function(event) {
    event.preventDefault();

    var saveBtn = this;
    saveBtn.disabled = true;

    var spinner = document.createElement("span");
    spinner.classList.add("spinner-border", "spinner-border-sm");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-hidden", "true");
    saveBtn.innerHTML = "";
    saveBtn.appendChild(spinner);

    var siteDescription = document.getElementById("vaultSiteDescription").value;
    var siteUrl = document.getElementById("vaultSiteUrl").value;
    var uniqueUrl = document.getElementById("vaultUniqueUrl").value;
    var username = document.getElementById("vaultUsername").value;
    var uniqueId = document.getElementById("vaultUniqueId").value;
    var email = document.getElementById("vaultEmail").value;
    var password = document.getElementById("vaultPassword").value;
    var pin = document.getElementById("vaultLoginPin").value;
    var notes = document.getElementById("vaultLoginNotes").value;
    var code = document.getElementById("vaultLoginCode").value;

    var loginForOptions = [];
    if (document.getElementById("vaultSiteOption1").checked) loginForOptions.push("Personal");
    if (document.getElementById("vaultSiteOption2").checked) loginForOptions.push("Enterpriselux");
    if (document.getElementById("vaultSiteOption3").checked) loginForOptions.push("Vapor Edge");
    if (document.getElementById("vaultSiteOption4").checked) loginForOptions.push("All Businesses");
    if (document.getElementById("vaultSiteOption5").checked) loginForOptions.push("Mendoza's Precious Metals");
    if (document.getElementById("vaultSiteOption6").checked) loginForOptions.push("White Nirvana");

    console.log("siteDescription:", siteDescription);
    console.log("url:", siteUrl);
    console.log("uniqueUrl:", uniqueUrl);
    console.log("username:", username);
    console.log("uniqueId:", uniqueId);
    console.log("email:", email);
    console.log("password:", password);
    console.log("pin:", pin);
    console.log("code:", code);
    console.log("loginForOptions:", loginForOptions);
    console.log("notes:", notes);

    if (!siteUrl || !username || !password) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = "Save";

      showVaultAlert('.vault-alert', 'danger', 'Please fill out all required fields.');
      return;
    }

    // Check if email is valid
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = "Save";
      showVaultAlert('.vault-alert', 'danger', 'Please enter a valid email address.');
      return;
    }

    // Check if site url if it's not empty and if it's a valid url
    if (siteUrl && !isValidURL(siteUrl)) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = "Save";
      showVaultAlert('.vault-alert', 'danger', 'Please enter a valid URL.');
      return;
    }

    // Check if unique url if it's not empty and if it's a valid url
    if (uniqueUrl && !isValidURL(uniqueUrl)) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = "Save";
      showVaultAlert('.vault-alert', 'danger', 'Please enter a valid URL for the Unique URL.');
      return;
    }

    // Check if password is at least 8 characters long
    if (password.length < 8) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = "Save";

      showVaultAlert('.vault-alert', 'danger', 'Password must be at least 8 characters long.');
      return;
    }

    hideVaultAlert('.vault-alert');

    var requestData = {
      siteDescription: siteDescription,
      url: siteUrl,
      uniqueUrl: uniqueUrl,
      username: username,
      uniqueId: uniqueId,
      email: email,
      password: password,
      pin: pin,
      code: code,
      vaultFor: loginForOptions,
      notes: notes,
      createdOn: new Date()
    };

    console.log("Request data:", requestData);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/save-vault-login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var responseData = JSON.parse(xhr.responseText);
          console.log("Response data:", responseData);

          saveBtn.disabled = false;
          saveBtn.innerHTML = "Save";

          showVaultAlert('.vault-alert', 'success', responseData.message);
          setTimeout(function() {
            var modal = document.getElementById('saveVaultModal');
            var modalBackdrop = document.querySelector('.modal-backdrop');
            
            document.getElementById("saveVaultLoginForm").reset();
            
            getAllVaultLogins();

            modal.classList.remove('show');
            if (modalBackdrop) {
              hideVaultAlert('.vault-alert');
              modalBackdrop.style.display = 'none'; 
            }
          }, 3000);
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          showVaultAlert('.vault-alert', 'danger', 'Error parsing server response.');

          saveBtn.disabled = false;
          saveBtn.innerHTML = "Save";
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          console.error(response.error);
          showVaultAlert('.vault-alert', 'danger', response.error);
        } catch (error) {
          console.error("Error parsing server response:", error);
          showVaultAlert('.vault-alert', 'danger', 'Error parsing server response.');
        }

        saveBtn.disabled = false;
        saveBtn.innerHTML = "Save";
      }
    };
    xhr.onerror = function() {
      console.error("Network error occurred");
      showVaultAlert('.vault-alert', 'danger', 'Network error occurred');

      saveBtn.disabled = false;
      saveBtn.innerHTML = "Save";
    };
    xhr.send(JSON.stringify(requestData));
  });

  // Add event listener for the edit button for the vault login form
  // Since is update checking for only filled fields, if the field is empty don't update it
  document.getElementById("edit-save-btn").addEventListener("click", function(event) {
    event.preventDefault();

    const editBtn = this;
    editBtn.disabled = true;

    const spinner = document.createElement("span");
    spinner.classList.add("spinner-border", "spinner-border-sm");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-hidden", "true");
    editBtn.innerHTML = "";
    editBtn.appendChild(spinner);

    const editVaultId = document.getElementById("vaultEditId").value;
    const editSiteDescription = document.getElementById("vaultEditSiteDescription").value;
    const editSiteUrl = document.getElementById("vaultEditSiteUrl").value;
    const editUniqueUrl = document.getElementById("vaultEditUniqueUrl").value;
    const editUsername = document.getElementById("vaultEditUsername").value;
    const editUniqueId = document.getElementById("vaultEditUniqueId").value;
    const editEmail = document.getElementById("vaultEditEmail").value;
    const editPassword = document.getElementById("vaultEditPassword").value;
    const editLoginPin = document.getElementById("vaultEditLoginPin").value;
    const editLoginNotes = document.getElementById("vaultEditLoginNotes").value;
    const editLoginCode = document.getElementById("vaultEditLoginCode").value;

    const editLoginFor = [];
    if (document.getElementById("vaultSiteEditOption1").checked) editLoginFor.push("Personal");
    if (document.getElementById("vaultSiteEditOption2").checked) editLoginFor.push("Enterpriselux");
    if (document.getElementById("vaultSiteEditOption3").checked) editLoginFor.push("Vapor Edge");
    if (document.getElementById("vaultSiteEditOption4").checked) editLoginFor.push("All Businesses");
    if (document.getElementById("vaultSiteEditOption5").checked) editLoginFor.push("Mendoza's Precious Metals");
    if (document.getElementById("vaultSiteEditOption6").checked) editLoginFor.push("White Nirvana");

    console.log("editSiteUrl:", editSiteUrl);

    // Check if password is at least 8 characters long
    if (editPassword && editPassword.length < 8) {
      editBtn.disabled = false;
      editBtn.innerHTML = "Save";
      showVaultAlert('.edit-vault-alert', 'danger', 'Password must be at least 8 characters long.');
      return;
    }

    // Check if email is not empty and is valid
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editEmail && !emailPattern.test(editEmail)) {
      editBtn.disabled = false;
      editBtn.innerHTML = "Save";
      showVaultAlert('.edit-vault-alert', 'danger', 'Please enter a valid email address.');
      return;
    }

    // Check if site url if it's not empty and if it's a valid url
    if (editSiteUrl && !isValidURL(editSiteUrl)) {
      editBtn.disabled = false;
      editBtn.innerHTML = "Save";
      showVaultAlert('.edit-vault-alert', 'danger', 'Please enter a valid URL.');
      return;
    }

    // Check if unique url if it's not empty and if it's a valid url
    if (editUniqueUrl && !isValidURL(editUniqueUrl)) {
      editBtn.disabled = false;
      editBtn.innerHTML = "Save";
      showVaultAlert('.edit-vault-alert', 'danger', 'Please enter a valid URL for the Unique URL.');
      return;
    }

    hideVaultAlert('.edit-vault-alert');

    const requestData = {
      siteDescription: editSiteDescription || undefined,
      url: editSiteUrl || undefined,
      uniqueUrl: editUniqueUrl || undefined,
      username: editUsername || undefined,
      uniqueId: editUniqueId || undefined,
      email: editEmail || undefined,
      password: editPassword || undefined,
      pin: editLoginPin || undefined,
      code: editLoginCode || undefined,
      notes: editLoginNotes || undefined,
      vaultFor: editLoginFor
    };

    console.log("Request data:", requestData);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/edit-vault-login/${editVaultId}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const responseData = JSON.parse(xhr.responseText);
          console.log("Response data:", responseData);

          editBtn.disabled = false;
          editBtn.innerHTML = "Save";

          showVaultAlert('.edit-vault-alert', 'success', responseData.message);
          getAllVaultLogins();

          setTimeout(() => {
            const modal = document.getElementById('editVaultModal');
            const modalBackdrop = document.querySelector('.modal-backdrop');

            document.getElementById("editVaultModalForm").reset();
            modal.classList.remove('show');
            if (modalBackdrop) {
              hideVaultAlert('.edit-vault-alert');
              modalBackdrop.style.display = 'none';
            }
          }, 3000);
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          showVaultAlert('.edit-vault-alert', 'danger', 'Error parsing server response.');
          editBtn.disabled = false;
          editBtn.innerHTML = "Save";
        }
      } else {

        try {
          const response = JSON.parse(xhr.responseText);
          console.error(response.error);
          showVaultAlert('.edit-vault-alert', 'danger', response.error);
        } catch (error) {
          console.error("Error parsing server response:", error);
          showVaultAlert('.edit-vault-alert', 'danger', response.error);
        }
        editBtn.disabled = false;
        editBtn.innerHTML = "Save";
      }
    };
    xhr.onerror = function() {
      console.error("Network error occurred");
      showVaultAlert('.edit-vault-alert', 'danger', 'Network error occurred');
      editBtn.disabled = false;
      editBtn.innerHTML = "Save";
    };
    xhr.send(JSON.stringify(requestData));
  });

  // Add event listener for the delete button for the vault login modal
  document.getElementById("delete-vault-btn").addEventListener("click", function(event) {
    event.preventDefault();

    var deleteBtn = this;
    deleteBtn.disabled = true;

    let deleteVaultTitle = document.getElementById("deleteVaultTitle");
    let deteVaultText = document.getElementById("deleteVaultText");

    var spinner = document.createElement("span");
    spinner.classList.add("spinner-border", "spinner-border-sm");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-hidden", "true");
    deleteBtn.innerHTML = "";
    deleteBtn.appendChild(spinner);

    const deleteVaultId = document.getElementById("deleteVaultId").value;
    console.log("deleteVaultId:", deleteVaultId);

    if (deleteVaultId == null || deleteVaultId.length < 1) {
      deleteBtn.disabled = false;
      deleteBtn.innerHTML = "Yes, Delete It";
      return;
    }

    const requestData = {
      id: deleteVaultId
    };

    console.log("Request data:", requestData);
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/delete-vault-login/${deleteVaultId}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var responseData = JSON.parse(xhr.responseText);
          console.log("Response data:", responseData);

          deleteBtn.disabled = false;
          deleteBtn.innerHTML = "Yes, Delete It";

          deleteVaultTitle.textContent = "Deleted!";
          deteVaultText.textContent = responseData.message;
          
          setTimeout(function() {

            var modal = document.getElementById('deleteVaultModal');
            var modalBackdrop = document.querySelector('.modal-backdrop');

            document.getElementById("deleteVaultId").value = "";

            modal.classList.remove('show');
            if (modalBackdrop) {
              deleteVaultTitle.textContent = "You are about to delete a login ?";
              deteVaultText.textContent = "Deleting the login data will remove the information from our database.";
              modalBackdrop.style.display = 'none'; 
            }

            getAllVaultLogins();
            
          }, 3000);

        } catch (error) {
          console.error("Error parsing JSON response:", error);
          deleteVaultTitle.textContent = "Delete Failed!";
          deteVaultText.textContent = "Error parsing server response";

          deleteBtn.disabled = false;
          deleteBtn.innerHTML = "Yes, Delete It";
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          console.error(response.error);
          deleteVaultTitle.textContent = "Delete Failed!";
          deteVaultText.textContent = response.error;

          deleteBtn.disabled = false;
          deleteBtn.innerHTML = "Yes, Delete It";
        } catch (error) {
          console.error("Error parsing server response:", error);
          deteVaultText.textContent = response.error;

          deleteBtn.disabled = false;
          deleteBtn.innerHTML = "Yes, Delete It";
        }
      }
    };
    xhr.onerror = function() {
      console.error("Network error occurred");
      deleteVaultTitle.textContent = "Delete Failed!";
      deteVaultText.textContent = "Network error occurred. Please try again.";

      deleteBtn.disabled = false;
      deleteBtn.innerHTML = "Yes, Delete It";
    };
      
    xhr.send(JSON.stringify(requestData));
  });

  // Add all checkboxes to the grid after it renders
  setTimeout(() => {
    addCheckAllBox();
  }, 1000);

});

function getAllVaultLogins() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/vault-logins", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        var responseData = JSON.parse(xhr.responseText);
        console.log("Response data:", responseData);
        //showSweetAlert('Success', 'Data fetched successfully', 'success', 'OK')
        data = responseData.data;
        updateGrid(data, grid);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        showSweetAlert('Error', 'Error parsing server response', 'error', 'OK');
      }
    } else {
      console.error("Error fetching data:", xhr.responseText);
      showSweetAlert('Error', 'Error fetching data. Please try again.', 'error', 'OK');
    }
  };
  xhr.onerror = function() {
    console.error("Network error occurred");
    showSweetAlert('Network Error', 'Network error occurred. Please try again.', 'error', 'OK');
  };
  xhr.send();
}

function updateVaultLoginUsage(id) {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", `/update-vault-login-usage/${id}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        var responseData = JSON.parse(xhr.responseText);
        console.log("Response data:", responseData);
        getAllVaultLogins();
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        showSweetAlert('Error', 'Error parsing server response', 'error', 'OK');
      }
    } else {
      const response = JSON.parse(xhr.responseText);
      console.error(response.error);
      showSweetAlert('Error', response.error, 'error', 'OK');
    }
  };
  xhr.onerror = function() {
    console.error("Network error occurred");
    showSweetAlert('Network Error', 'Network error occurred. Please try again.', 'error', 'OK');
  };
  xhr.send();
}

function showSweetAlert(title, text, icon, confirmButtonText) {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    buttonsStyling: false,
    confirmButtonText: confirmButtonText,
    showCloseButton: false,
    customClass: {
      confirmButton: 'btn btn-success'
    },
  });
}

function showVaultAlert(className, type, message) {
  var alertElement = document.querySelector(className);
  if (alertElement) {
    alertElement.innerHTML = `<div class="alert alert-${type} text-center mb-4 flash" role="alert">${message}</div>`;
    alertElement.style.display = "block";
  }
}

function hideVaultAlert(className) {
  var alertElement = document.querySelector(className);
  if (alertElement) {
    alertElement.innerHTML = "";
    alertElement.style.display = "none";
  }

  // Show the backdrop again if it exists
  var modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.style.display = 'block';
  }
}

function updateGrid(data, grid){
  resetScrollbar();

  const upddateGridData = data.map(item => [
    item._id,
    item.url,
    item.vaultFor,
    item.username ? formatMTMText(item.username, null, 24, 21) : '',
    item.email ? formatMTMText(item.email, null, 24, 21) : '',
    item.password,
    item.lastUsedBy ? formatMTMText(item.lastUsedBy, null, 27, 24) : '',
    item.lastUsedOn ? formatDate(item.lastUsedOn) : '',
    item._id,
    item.createdOn
  ]);

  // sort grid data by createdOn date
  upddateGridData.sort((a, b) => new Date(b[9]) - new Date(a[9]));

  grid.updateConfig({
    columns: gridColumn,
    data: upddateGridData,
    pagination: {
      limit: 10
    },
    //search: true,
  }).forceRender();
  
}