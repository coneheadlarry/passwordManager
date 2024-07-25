window.addEventListener('DOMContentLoaded', async () => {
  const firstTimePopUP = document.getElementById('firstOpen');
  const historyGuideDialog = document.getElementById('historyGuideDialog');
  const historyGuide = document.getElementById('historyGuide');
  const closeButtons = document.querySelectorAll('.closePopUP');

  const generateBtn = document.getElementById('generateBtn');
  const generationConfirmDialog = document.getElementById('generationConfirmDialog');
  const confirmGenerateBtn = document.getElementById('confirmGenerate');

  const showNewFeatureDialog = document.getElementById('showNewFeatureDialog');
  const newFeatureDialog = document.getElementById('newFeatureDialog');

  const showGenerateDialog = document.getElementById('showGenerateDialog');
  const generateGuideDialog = document.getElementById('generateGuideDialog');

  const historyBtn = document.getElementById('HistoryBtn'); 
  const historyDialog = document.getElementById('historyDialog');
  const historyList = document.getElementById('historyList'); 
  
  // Check if it's the first time the app is opened if it is display tab nagivation message
  try {
    const firstOpenValue = await window.electron.getFileData();
    if (firstOpenValue.trim() === 'True') {
      firstTimePopUP.showModal();
    }
  } catch (error) {
    console.error('Error reading file:', error);
  }

  // Add event listeners to close buttons to close parent/dialog pop up
  closeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const dialog = event.target.closest('dialog');
      if (dialog) {
        dialog.close();
      }
      if (firstTimePopUP.open) {
        firstTimePopUP.close();
        window.electron.updateFileData('False').catch(console.error);
      }
    });
  });

  // Add event listener to history guide button to show history guide dialog
  historyGuide.addEventListener('click', () => {
    historyGuideDialog.showModal();
  });

  // Add event listener to generate button to show confirmation dialog
  // as well as populate the confirmation text with the selected values
  generateBtn.addEventListener('click', () => {
    const specialChars = document.getElementById('specialChars').value;
    const numbers = document.getElementById('numbers').value;
    const length = document.getElementById('length').value;

    const confirmationText = `You have selected ${specialChars} special character(s), ${numbers} number(s), and a password length of ${length} characters. Do you want to proceed with password generation?`;

    document.getElementById('confirmationText').innerText = confirmationText;
    generationConfirmDialog.showModal();
  });

  // Add event listener to confirm generate button to generate password
  confirmGenerateBtn.addEventListener('click', async () => {
    const specialChars = document.getElementById('specialChars').value;
    const numbers = document.getElementById('numbers').value;
    const length = document.getElementById('length').value;

    // Generate the password and update the input field
    try {
      const password = await window.electron.generatePassword(specialChars, numbers, length);
      document.getElementById('password-input').value = password;
      generationConfirmDialog.close();
    } catch (error) {
      console.error('Error generating password:', error);
    }
  });

  // Add event listeners to show new feature
  showNewFeatureDialog.addEventListener('click', () => {
    newFeatureDialog.showModal();
  });

  // Add event listeners to show generate guide
  showGenerateDialog.addEventListener('click', () => {
    generateGuideDialog.showModal();
  });

  // Add event listener to history button to show history dialog
  historyBtn.addEventListener('click', async () => {
    try {
      const history = await window.electron.getPasswordHistory();
      
      // Clear the current list
      historyList.innerHTML = '';

      // Populate the list with passwords
      history.forEach(password => {
        const listItem = document.createElement('li');
        listItem.textContent = password;
        historyList.appendChild(listItem);
      });

      // Show the history dialog
      historyDialog.showModal();
    } catch (error) {
      console.error('Error fetching password history:', error);
    }
  });
});
