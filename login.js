
function toggleAuth() {
  document.querySelector('.auth-container').classList.toggle('active');
}
document.querySelector('.auth-container').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.remove('active');
  }
});

function switchTab(tab) {

  // gombok active állapot törlése
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // formok elrejtése
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });

  if (tab === 'login') {
    document.getElementById('login-form').classList.add('active');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
  } else {
    document.getElementById('register-form').classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
  }
}