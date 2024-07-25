window.addEventListener('DOMContentLoaded', async () => {
  const firstTimePopUP = document.getElementById('firstOpen');
  const historyGuideDialog = document.getElementById('historyGuideDialog');
  const historyGuide = document.getElementById('historyGuide');
  const closeButtons = document.querySelectorAll('#closePopUP');

  const generateBtn = document.getElementById('generateBtn');
  const generationConfirmDialog = document.getElementById('generationConfirmDialog');
  const confirmGenerateBtn = document.getElementById('confirmGenerate');
  const cancelGenerateBtn = document.getElementById('closePopUP');

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
      if (generationConfirmDialog.open) {
        generationConfirmDialog.close();
      }
    });
  });

  historyGuide.addEventListener('click', () => {
    historyGuideDialog.showModal();
  });

  generateBtn.addEventListener('click', () => {
    const specialChars = document.getElementById('specialChars').value;
    const numbers = document.getElementById('numbers').value;
    const length = document.getElementById('length').value;

    const confirmationText = `You have selected ${specialChars} special character(s), ${numbers} number(s), and a password length of ${length} characters. Do you want to proceed with password generation?`;

    document.getElementById('confirmationText').innerText = confirmationText;
    generationConfirmDialog.showModal();
  });

  confirmGenerateBtn.addEventListener('click', async () => {
    const specialChars = document.getElementById('specialChars').value;
    const numbers = document.getElementById('numbers').value;
    const length = document.getElementById('length').value;

    try {
      const password = await window.electron.generatePassword(specialChars, numbers, length);
      document.getElementById('password-input').value = password;
      generationConfirmDialog.close();
    } catch (error) {
      console.error('Error generating password:', error);
    }
  });

  cancelGenerateBtn.addEventListener('click', () => {
    generationConfirmDialog.close();
  });
});
