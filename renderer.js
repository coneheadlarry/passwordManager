window.addEventListener('DOMContentLoaded', async () => {
  const firstTimePopUP = document.getElementById('firstOpen');
  const historyGuideDialog = document.getElementById('historyGuideDialog');
  const historyGuide = document.getElementById('historyGuide');
  const closeButtons = document.querySelectorAll('#closePopUP'); // Use a specific selector to avoid conflicts

  try {
    const firstOpenValue = await window.electron.getFileData();
    if (firstOpenValue.trim() === 'True') {
      firstTimePopUP.showModal();
    }
  } catch (error) {
    console.error('Error reading file:', error);
  }

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (firstTimePopUP.open) {
        firstTimePopUP.close();
        window.electron.updateFileData('False').catch(console.error);
      }
      if (historyGuideDialog.open) {
        historyGuideDialog.close();
      }
    });
  });

  historyGuide.addEventListener('click', () => {
    historyGuideDialog.showModal();
  });

  // Add the event listener for password generation
  document.getElementById('generateBtn').addEventListener('click', async () => {
    const specialChars = document.getElementById('specialChars').value;
    const numbers = document.getElementById('numbers').value;
    const length = document.getElementById('length').value;

    try {
      // Call the IPC method to generate the password
      const password = await window.electron.generatePassword(specialChars, numbers, length);
      document.getElementById('password-input').value = password;
    } catch (error) {
      console.error('Error generating password:', error);
    }
  });
});
