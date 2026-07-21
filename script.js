/* =============================================
   script.js — Toàn bộ JavaScript Portfolio
   Cấu trúc file:
     1. Hamburger menu (mobile)
     2. Active nav khi cuộn
     3. Modal kỹ năng (Skills)
     4. Accordion dự án (Projects)
     5. Form liên hệ (Contact)
     6. Quản lý kỹ năng (Admin: thêm / sửa / xóa)
     7. Quản lý dự án (Admin: thêm / sửa / xóa)
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
   3. MODAL KỸ NĂNG (Skills popup — ai cũng xem được)
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

// Bấm phím Escape → đóng modal (skill modal + admin form modal)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSkillModal();
    closeEditForm();
    closeProjectForm();
  }
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


/* =============================================
   6. QUẢN LÝ KỸ NĂNG (Admin: thêm / sửa / xóa)
   ---------------------------------------------
   - Người xem bình thường: chỉ thấy danh sách kỹ năng,
     bấm vào để xem chi tiết (như cũ) — KHÔNG sửa/xóa được.
   - Chủ trang: vào link kèm ?admin=1 (VD: yourlink.com/?admin=1),
     nhập đúng mật khẩu bên dưới sẽ mở khoá nút Thêm / Sửa / Xoá.
   - Dữ liệu kỹ năng được lưu trong localStorage của trình duyệt,
     nên sẽ được giữ lại mỗi lần bạn quay lại BẰNG CHÍNH trình duyệt đó.
     (Lưu ý: đây là web tĩnh không có server, nên nếu bạn sửa trên máy A,
     người xem trên máy B sẽ không tự động thấy thay đổi đó.)
============================================= */

// ĐỔI MẬT KHẨU QUẢN TRỊ CỦA BẠN TẠI ĐÂY:
const ADMIN_PASSWORD = 'admin123';

// Danh sách kỹ năng mặc định — chỉ dùng lần đầu tiên khi
// trình duyệt chưa lưu gì trong localStorage
const defaultSkills = [
  {
    id: 's1', icon: 'fa-brands fa-html5', title: 'HTML5',
    level: 65, levelText: 'Cơ bản – Trung cấp',
    desc: 'Nắm vững cấu trúc trang web với HTML5, biết sử dụng các thẻ ngữ nghĩa như header, section, article, footer. Có thể xây dựng bố cục trang web hoàn chỉnh.',
    tags: ['Semantic HTML', 'Forms', 'Tables', 'Media', 'Accessibility']
  },
  {
    id: 's2', icon: 'fa-brands fa-css3-alt', title: 'CSS3',
    level: 60, levelText: 'Cơ bản – Trung cấp',
    desc: 'Biết tạo giao diện responsive với Flexbox và Grid. Có kinh nghiệm với animation, transition và CSS variables để xây dựng UI đẹp, nhất quán.',
    tags: ['Flexbox', 'Grid', 'Animation', 'Responsive', 'Variables']
  },
  {
    id: 's3', icon: 'fa-brands fa-bootstrap', title: 'Bootstrap 5',
    level: 45, levelText: 'Cơ bản',
    desc: 'Sử dụng được hệ thống grid của Bootstrap, các component cơ bản như navbar, card, button, modal. Biết tùy chỉnh giao diện nhanh chóng với utility classes.',
    tags: ['Grid System', 'Components', 'Utilities', 'Responsive']
  },
  {
    id: 's4', icon: 'fa-brands fa-js', title: 'JavaScript',
    level: 40, levelText: 'Cơ bản',
    desc: 'Hiểu các khái niệm căn bản: biến, hàm, vòng lặp, điều kiện, DOM manipulation. Có thể viết script đơn giản để xử lý sự kiện và tương tác với trang web.',
    tags: ['DOM', 'Events', 'Functions', 'Arrays', 'ES6 Basics']
  },
  {
    id: 's5', icon: 'fa-brands fa-github', title: 'GitHub',
    level: 40, levelText: 'Cơ bản',
    desc: 'Biết sử dụng Git cơ bản: init, add, commit, push, pull. Có thể tạo repository, quản lý phiên bản code và cộng tác thông qua GitHub.',
    tags: ['Git', 'Repository', 'Commit', 'Push/Pull', 'Version Control']
  },
  {
    id: 's6', icon: 'fa-solid fa-cloud', title: 'Cloud Computing',
    level: 30, levelText: 'Cơ bản',
    desc: 'Nắm được các khái niệm căn bản về điện toán đám mây: IaaS, PaaS, SaaS. Tìm hiểu về các dịch vụ cơ bản của AWS/Google Cloud như lưu trữ và máy chủ ảo.',
    tags: ['IaaS', 'PaaS', 'SaaS', 'Cloud Storage', 'Virtual Server']
  }
];

let skills        = [];   // danh sách kỹ năng đang hiển thị
let isAdmin       = false; // đang ở chế độ quản trị hay không
let editingSkillId = null; // null = đang thêm mới, có id = đang sửa kỹ năng đó

// Đọc danh sách kỹ năng đã lưu trong trình duyệt (nếu có), không thì dùng mặc định
function loadSkills() {
  const saved = localStorage.getItem('portfolio_skills');
  skills = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultSkills));
}

// Lưu danh sách kỹ năng hiện tại vào trình duyệt
function saveSkills() {
  localStorage.setItem('portfolio_skills', JSON.stringify(skills));
}

// Vẽ lại toàn bộ lưới kỹ năng dựa trên mảng "skills" và trạng thái "isAdmin"
function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = '';

  skills.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.dataset.title     = skill.title;
    card.dataset.level     = skill.level;
    card.dataset.levelText = skill.levelText;
    card.dataset.desc      = skill.desc;
    card.dataset.tags      = skill.tags.join('|');

    // Bấm vào card → mở modal xem chi tiết (giống cũ, ai cũng bấm được)
    card.addEventListener('click', () => openSkillModal(card));

    card.innerHTML = `
      <div class="skill-icon"><i class="${skill.icon}"></i></div>
      <div>
        <div class="skill-name">${skill.title}</div>
        <div class="skill-level">${skill.levelText}</div>
        <div class="skill-hint"><i class="fa-solid fa-circle-info"></i> Bấm để xem chi tiết</div>
      </div>
      ${isAdmin ? `
        <div class="skill-admin-actions">
          <button class="skill-admin-btn edit" title="Sửa kỹ năng">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="skill-admin-btn delete" title="Xóa kỹ năng">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      ` : ''}
    `;

    // Gắn sự kiện cho nút Sửa / Xóa (chỉ tồn tại khi isAdmin = true)
    if (isAdmin) {
      const editBtn   = card.querySelector('.skill-admin-btn.edit');
      const deleteBtn = card.querySelector('.skill-admin-btn.delete');

      editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // không cho mở modal xem chi tiết khi bấm Sửa
        openEditForm(skill.id);
      });

      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSkill(skill.id);
      });
    }

    grid.appendChild(card);
  });

  // Card "Thêm kỹ năng" ở cuối lưới — chỉ hiện khi đang ở chế độ quản trị
  if (isAdmin) {
    const addCard = document.createElement('div');
    addCard.className = 'skill-card skill-card-add';
    addCard.innerHTML = `
      <div class="skill-icon"><i class="fa-solid fa-plus"></i></div>
      <div><div class="skill-name">Thêm kỹ năng</div></div>
    `;
    addCard.addEventListener('click', () => openEditForm(null));
    grid.appendChild(addCard);
  }
}

/* ---------- ĐĂNG NHẬP / ĐĂNG XUẤT QUẢN TRỊ ---------- */

// Kiểm tra URL có ?admin=1 không, nếu có thì hỏi mật khẩu
function checkAdminAccess() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== '1') return;

  const pass = prompt('Nhập mật khẩu quản trị:');
  if (pass === null) return; // bấm Cancel

  if (pass === ADMIN_PASSWORD) {
    isAdmin = true;
    document.getElementById('adminBadge').style.display = 'flex';
    renderSkills();   // vẽ lại để hiện nút Sửa/Xóa + card Thêm
    renderProjects(); // vẽ lại để hiện nút Sửa/Xóa + nút Thêm dự án
  } else {
    alert('Sai mật khẩu!');
  }
}

// Bấm vào badge "Chế độ quản trị" → thoát khỏi chế độ quản trị
function adminLogout() {
  isAdmin = false;
  document.getElementById('adminBadge').style.display = 'none';
  renderSkills();
  renderProjects();
}

/* ---------- FORM THÊM / SỬA KỸ NĂNG ---------- */

// Mở form: truyền id để Sửa, truyền null để Thêm mới
function openEditForm(id) {
  editingSkillId = id;

  if (id) {
    const skill = skills.find(s => s.id === id);
    document.getElementById('formTitle').value     = skill.title;
    document.getElementById('formIcon').value      = skill.icon;
    document.getElementById('formLevel').value     = skill.level;
    document.getElementById('formLevelText').value = skill.levelText;
    document.getElementById('formDesc').value      = skill.desc;
    document.getElementById('formTags').value      = skill.tags.join(', ');
    document.getElementById('adminFormTitle').textContent = 'Sửa kỹ năng';
  } else {
    document.getElementById('formTitle').value     = '';
    document.getElementById('formIcon').value      = '';
    document.getElementById('formLevel').value     = '';
    document.getElementById('formLevelText').value = '';
    document.getElementById('formDesc').value      = '';
    document.getElementById('formTags').value      = '';
    document.getElementById('adminFormTitle').textContent = 'Thêm kỹ năng mới';
  }

  document.getElementById('adminFormModal').classList.add('open');
}

// Đóng form thêm/sửa
function closeEditForm() {
  const modal = document.getElementById('adminFormModal');
  if (modal) modal.classList.remove('open');
}

// Bấm vùng tối ngoài form → đóng form
function closeAdminFormOnOverlay(e) {
  if (e.target.id === 'adminFormModal') {
    closeEditForm();
  }
}

// Lưu kỹ năng (thêm mới hoặc cập nhật kỹ năng đang sửa)
function saveSkillForm() {
  const title     = document.getElementById('formTitle').value.trim();
  const icon      = document.getElementById('formIcon').value.trim() || 'fa-solid fa-star';
  const level     = Math.max(0, Math.min(100, parseInt(document.getElementById('formLevel').value) || 0));
  const levelText = document.getElementById('formLevelText').value.trim() || 'Cơ bản';
  const desc      = document.getElementById('formDesc').value.trim();
  const tags      = document.getElementById('formTags').value
                      .split(',')
                      .map(t => t.trim())
                      .filter(Boolean);

  if (!title || !desc) {
    alert('Vui lòng nhập ít nhất Tên kỹ năng và Mô tả!');
    return;
  }

  if (editingSkillId) {
    // Đang sửa kỹ năng có sẵn
    const skill = skills.find(s => s.id === editingSkillId);
    Object.assign(skill, { title, icon, level, levelText, desc, tags });
  } else {
    // Thêm kỹ năng mới
    skills.push({
      id: 's' + Date.now(), // tạo id duy nhất dựa trên thời gian
      icon, title, level, levelText, desc, tags
    });
  }

  saveSkills();
  renderSkills();
  closeEditForm();
}

// Xóa 1 kỹ năng (có xác nhận trước khi xóa)
function deleteSkill(id) {
  const skill = skills.find(s => s.id === id);
  if (!skill) return;

  const confirmed = confirm(`Bạn có chắc muốn xóa kỹ năng "${skill.title}" không?`);
  if (!confirmed) return;

  skills = skills.filter(s => s.id !== id);
  saveSkills();
  renderSkills();
}

/* =============================================
   7. QUẢN LÝ DỰ ÁN (Admin: thêm / sửa / xóa)
   ---------------------------------------------
   Hoạt động giống hệt phần Quản lý kỹ năng ở trên:
   - Người xem bình thường: chỉ xem, bấm mở/đóng dự án như cũ.
   - Admin (vào bằng ?admin=1 + đúng mật khẩu): thấy nút Sửa/Xóa
     trên mỗi dự án, và nút "+ Thêm dự án" ở cuối danh sách.
   - Dữ liệu lưu trong localStorage của trình duyệt.
============================================= */

// Danh sách dự án mặc định — chỉ dùng lần đầu khi chưa lưu gì trong localStorage
const defaultProjects = [
  {
    id: 'p1',
    title: 'Web Portfolio Cá Nhân',
    tag: 'HTML · CSS · JavaScript',
    desc: 'Trang web portfolio cá nhân giới thiệu bản thân, kỹ năng và dự án. Được xây dựng hoàn toàn bằng HTML, CSS và JavaScript thuần, không sử dụng framework. Giao diện responsive, hiển thị tốt trên cả máy tính lẫn điện thoại.',
    techs: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    github: 'https://github.com/anananan202004-oss/portfolio',
    demo: 'https://portfoliocanhan.netlify.app/'
  }
];

let projects         = [];  // danh sách dự án đang hiển thị
let editingProjectId = null; // null = đang thêm mới, có id = đang sửa dự án đó

// Đọc danh sách dự án đã lưu trong trình duyệt (nếu có), không thì dùng mặc định
function loadProjects() {
  const saved = localStorage.getItem('portfolio_projects');
  projects = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultProjects));
}

// Lưu danh sách dự án hiện tại vào trình duyệt
function saveProjects() {
  localStorage.setItem('portfolio_projects', JSON.stringify(projects));
}

// Vẽ lại toàn bộ danh sách dự án dựa trên mảng "projects" và trạng thái "isAdmin"
function renderProjects() {
  const list = document.getElementById('projectList');
  list.innerHTML = '';

  // Chưa có dự án nào
  if (projects.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'no-projects';
    empty.innerHTML = `
      <i class="fa-solid fa-folder-open"></i>
      <p><strong>Chưa có dự án nào</strong>
      ${isAdmin ? 'Bấm nút bên dưới để thêm dự án đầu tiên.' : 'Hãy quay lại sau nhé!'}</p>
    `;
    list.appendChild(empty);
  }

  projects.forEach((project, index) => {
    const item = document.createElement('div');
    item.className = 'project-item';

    const techsHTML = project.techs
      .map(t => `<span class="project-tech">${t}</span>`)
      .join('');

    const linksHTML = (project.github || project.demo) ? `
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:1rem;">
        ${project.github ? `
          <a href="${project.github}" target="_blank"
             style="display:inline-flex; align-items:center; gap:0.5rem; background:#1e1e2e; color:#fff; padding:0.5rem 1.1rem; border-radius:7px; text-decoration:none; font-size:0.85rem; font-weight:600;">
            <i class="fa-brands fa-github"></i> GitHub
          </a>` : ''}
        ${project.demo ? `
          <a href="${project.demo}" target="_blank"
             style="display:inline-flex; align-items:center; gap:0.5rem; background:#4f6ef7; color:#fff; padding:0.5rem 1.1rem; border-radius:7px; text-decoration:none; font-size:0.85rem; font-weight:600;">
            <i class="fa-solid fa-globe"></i> Xem Demo
          </a>` : ''}
      </div>` : '';

    item.innerHTML = `
      <div class="project-header">
        <div class="project-header-left">
          <div class="project-num">${String(index + 1).padStart(2, '0')}</div>
          <div>
            <div class="project-header-title">${project.title}</div>
            <div class="project-header-tag">${project.tag}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center;">
          ${isAdmin ? `
            <div class="project-admin-actions">
              <button class="skill-admin-btn edit" title="Sửa dự án">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="skill-admin-btn delete" title="Xóa dự án">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          ` : ''}
          <i class="fa-solid fa-chevron-down project-arrow"></i>
        </div>
      </div>
      <div class="project-body">
        <div class="project-body-inner">
          <p class="project-desc">${project.desc}</p>
          <div class="project-meta">${techsHTML}</div>
          ${linksHTML}
        </div>
      </div>
    `;

    // Bấm vào phần header (trừ nút Sửa/Xóa) → mở/đóng nội dung dự án
    const headerEl = item.querySelector('.project-header');
    headerEl.addEventListener('click', () => toggleProject(headerEl));

    // Gắn sự kiện cho nút Sửa / Xóa (chỉ tồn tại khi isAdmin = true)
    if (isAdmin) {
      const editBtn   = item.querySelector('.skill-admin-btn.edit');
      const deleteBtn = item.querySelector('.skill-admin-btn.delete');

      editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // không cho mở/đóng dự án khi bấm Sửa
        openProjectForm(project.id);
      });

      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProject(project.id);
      });
    }

    list.appendChild(item);
  });

  // Nút "Thêm dự án" ở cuối danh sách — chỉ hiện khi đang ở chế độ quản trị
  if (isAdmin) {
    const addBtn = document.createElement('div');
    addBtn.className = 'project-add-btn';
    addBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Thêm dự án`;
    addBtn.addEventListener('click', () => openProjectForm(null));
    list.appendChild(addBtn);
  }
}

/* ---------- FORM THÊM / SỬA DỰ ÁN ---------- */

// Mở form: truyền id để Sửa, truyền null để Thêm mới
function openProjectForm(id) {
  editingProjectId = id;

  if (id) {
    const project = projects.find(p => p.id === id);
    document.getElementById('formProjectTitle').value  = project.title;
    document.getElementById('formProjectTag').value    = project.tag;
    document.getElementById('formProjectDesc').value   = project.desc;
    document.getElementById('formProjectTechs').value  = project.techs.join(', ');
    document.getElementById('formProjectGithub').value = project.github || '';
    document.getElementById('formProjectDemo').value   = project.demo || '';
    document.getElementById('adminProjectFormTitle').textContent = 'Sửa dự án';
  } else {
    document.getElementById('formProjectTitle').value  = '';
    document.getElementById('formProjectTag').value    = '';
    document.getElementById('formProjectDesc').value   = '';
    document.getElementById('formProjectTechs').value  = '';
    document.getElementById('formProjectGithub').value = '';
    document.getElementById('formProjectDemo').value   = '';
    document.getElementById('adminProjectFormTitle').textContent = 'Thêm dự án mới';
  }

  document.getElementById('adminProjectFormModal').classList.add('open');
}

// Đóng form thêm/sửa dự án
function closeProjectForm() {
  const modal = document.getElementById('adminProjectFormModal');
  if (modal) modal.classList.remove('open');
}

// Bấm vùng tối ngoài form → đóng form
function closeProjectFormOnOverlay(e) {
  if (e.target.id === 'adminProjectFormModal') {
    closeProjectForm();
  }
}

// Lưu dự án (thêm mới hoặc cập nhật dự án đang sửa)
function saveProjectForm() {
  const title  = document.getElementById('formProjectTitle').value.trim();
  const tag    = document.getElementById('formProjectTag').value.trim();
  const desc   = document.getElementById('formProjectDesc').value.trim();
  const techs  = document.getElementById('formProjectTechs').value
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean);
  const github = document.getElementById('formProjectGithub').value.trim();
  const demo   = document.getElementById('formProjectDemo').value.trim();

  if (!title || !desc) {
    alert('Vui lòng nhập ít nhất Tên dự án và Mô tả!');
    return;
  }

  if (editingProjectId) {
    // Đang sửa dự án có sẵn
    const project = projects.find(p => p.id === editingProjectId);
    Object.assign(project, { title, tag, desc, techs, github, demo });
  } else {
    // Thêm dự án mới
    projects.push({
      id: 'p' + Date.now(), // tạo id duy nhất dựa trên thời gian
      title, tag, desc, techs, github, demo
    });
  }

  saveProjects();
  renderProjects();
  closeProjectForm();
}

// Xóa 1 dự án (có xác nhận trước khi xóa)
function deleteProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const confirmed = confirm(`Bạn có chắc muốn xóa dự án "${project.title}" không?`);
  if (!confirmed) return;

  projects = projects.filter(p => p.id !== id);
  saveProjects();
  renderProjects();
}


/* ---------- KHỞI CHẠY ---------- */
loadSkills();       // đọc dữ liệu kỹ năng (đã lưu hoặc mặc định)
renderSkills();      // vẽ lưới kỹ năng lần đầu (chế độ xem thường)
loadProjects();      // đọc dữ liệu dự án (đã lưu hoặc mặc định)
renderProjects();    // vẽ danh sách dự án lần đầu (chế độ xem thường)
checkAdminAccess();  // nếu có ?admin=1 + đúng mật khẩu thì mở khóa quản trị