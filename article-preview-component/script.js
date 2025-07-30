const shareBtn = document.querySelector('.btn');
const sharePopup = document.querySelector('.pop-up');

shareBtn.addEventListener('click', () => {
  sharePopup.style.display = sharePopup.style.display === 'flex' ? 'none' : 'flex';
});
