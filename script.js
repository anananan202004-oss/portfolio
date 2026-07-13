/* =============================================
   script.js — Toàn bộ JavaScript Portfolio
   Cấu trúc file:
     1. Hamburger menu (mobile)
     2. Active nav khi cuộn
     3. Modal kỹ năng (Skills)
     4. Accordion dự án (Projects)
     5. Form liên hệ (Contact)
============================================= */


/* =============================================
   1. HAMBURGER MENU (mobile)
============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Bấm nút hamburger → mở/đóng menu
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Bấm vào 1 link trong menu → tự đóng menu
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});


/* =============================================
   2. ACTIVE NAV KHI CUỘN TRANG
============================================= */
const sections = document.querySelectorAll('section');
const links    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  // Tìm section đang hiển thị trên màn hình
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 80) {
      current = section.getAttribute('id');
    }
  });

  // Đánh dấu link tương ứng là active
  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});


/* =============================================
   3. MODAL KỸ NĂNG (Skills popup)
============================================= */

// Mở modal khi bấm vào 1 skill card
function openSkillModal(card) {
  // Lấy dữ liệu từ data-attributes của card
  const title    = card.dataset.title;
  const level    = parseInt(card.dataset.level);
  const levelTxt = card.dataset.levelText;
  const desc     = card.dataset.desc;
  const tags     = card.dataset.tags.split('|'); // tách chuỗi tag bằng ký tự |

  // Lấy icon HTML từ card rồi đưa vào modal
  const iconHTML = card.querySelector('.skill-icon').innerHTML;

  // Điền nội dung vào các phần tử trong modal
  document.getElementById('modalIcon').innerHTML       = iconHTML;
  document.getElementById('modalTitle').textContent    = title;
  document.getElementById('modalSubtitle').textContent = levelTxt;
  document.getElementById('modalLevelPct').textContent = level + '%';
  document.getElementById('modalDesc').textContent     = desc;

  // Tạo tag badges từ mảng tags
  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = tags
    .map(t => `<span class="modal-tag">${t}</span>`)
    .join('');

  // Hiện modal
  document.getElementById('skillModal').classList.add('open');

  // Delay nhỏ để CSS transition thanh tiến độ hoạt động
  setTimeout(() => {
    document.getElementById('modalFill').style.width = level + '%';
  }, 50);
}

// Đóng modal
function closeSkillModal() {
  document.getElementById('skillModal').classList.remove('open');
  // Reset thanh tiến độ về 0 để lần sau animate lại từ đầu
  document.getElementById('modalFill').style.width = '0';
}

// Bấm vào vùng tối bên ngoài modal → đóng
function closeModalOnOverlay(e) {
  if (e.target.id === 'skillModal') {
    closeSkillModal();
  }
}

// Bấm phím Escape → đóng modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSkillModal();
});


/* =============================================
   4. ACCORDION DỰ ÁN (Projects)
============================================= */

// Bấm vào tiêu đề dự án → mở/đóng phần nội dung
function toggleProject(header) {
  const item   = header.parentElement; // phần tử cha .project-item
  const isOpen = item.classList.contains('open');

  // Đóng tất cả các dự án đang mở
  document.querySelectorAll('.project-item.open').forEach(el => {
    el.classList.remove('open');
  });

  // Nếu item đó chưa mở → mở lên
  // Nếu đang mở → giữ đóng (bấm lần 2 = đóng lại)
  if (!isOpen) {
    item.classList.add('open');
  }
}


/* =============================================
   5. FORM LIÊN HỆ (Contact)
============================================= */

function handleSubmit() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Kiểm tra không để trống
  if (!name || !email || !message) {
    alert('Vui lòng điền đầy đủ thông tin trước khi gửi!');
    return;
  }

  // Hiện thông báo cảm ơn
  document.getElementById('thankYou').classList.add('show');

  // Xoá nội dung form
  document.getElementById('name').value    = '';
  document.getElementById('email').value   = '';
  document.getElementById('message').value = '';

  // Tự ẩn thông báo sau 5 giây
  setTimeout(() => {
    document.getElementById('thankYou').classList.remove('show');
  }, 5000);
}