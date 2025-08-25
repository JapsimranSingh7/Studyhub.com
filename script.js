/* ==========================
   StudyHub A–Z (Vanilla JS)
   ==========================
   - Filters: class, subject, strand, level + search
   - Cards with Notes + Extra/Important Q&A
   - Bookmarks with localStorage
   - Notes pad with localStorage
   - Demo Chat (rule-based)
   - Import/Export JSON (for content)
*/

// ---------- Constants ----------
const CLASSES = [4,5,6,7,8,9,10];
const SUBJECTS = ["English","Maths","Science","SST"];
const STRANDS = [
  "Grammar","Tense","Literature", // English
  "Algebra","Geometry","Arithmetic", // Maths
  "Physics","Chemistry","Biology",  // Science
  "History","Geography","Civics","Economics" // SST
];
const LEVELS = ["Easy","Medium","Hard"];

const LS_BOOKMARKS = "sh_bookmarks_v1";
const LS_NOTES     = "sh_notes_v1";
const LS_THEME     = "sh_theme_v1";

// ---------- Sample Content (trimmed; extend via JSON) ----------
let CONTENT = [
  // ENGLISH – Grammar/Tense/Lit
  {id:"eng4-tense-simple", class:4, subject:"English", strand:"Tense", chapter:"Simple Tenses", title:"Simple Present / Past / Future", notes:"Facts & routines, finished actions, future plans.", questions:[
    {q:"Change to Past: He goes to school.", a:"He went to school.", level:"Easy", type:"Short", tags:["tense-change"]},
    {q:"Make a Present routine sentence.", a:"I brush my teeth every morning.", level:"Easy", type:"Short"},
    {q:"Underline the verb: They will watch a movie.", a:"will watch", level:"Easy", type:"Fill"},
  ]},
  {id:"eng7-reported", class:7, subject:"English", strand:"Grammar", chapter:"Reported Speech", title:"Direct → Indirect", notes:"Backshift tenses, change pronouns/time/place.", questions:[
    {q:"He said, 'I am tired.'", a:"He said that he was tired.", level:"Medium", type:"Short"},
    {q:"She said, 'Where are you going?'", a:"She asked where I was going.", level:"Hard", type:"Explain"}
  ]},
  {id:"eng6-lit-teamwork", class:6, subject:"English", strand:"Literature", chapter:"Teamwork Works", title:"Characters, plot, message", notes:"Cooperation and planning lead to success.", questions:[
    {q:"Character sketch of leader.", a:"Responsible, communicative, fair.", level:"Medium", type:"Long", tags:["important"]},
  ]},

  // MATHS – Algebra/Geometry/Arithmetic
  {id:"math8-alg-linear", class:8, subject:"Maths", strand:"Algebra", chapter:"Linear Equations", title:"Solve ax + b = c", notes:"Transpose terms, isolate variable.", questions:[
    {q:"Solve: 3x + 5 = 20", a:"x = 5", level:"Easy", type:"MCQ", tags:["important"]},
    {q:"Form an equation: Sum of a number and 7 is 15.", a:"x + 7 = 15", level:"Easy", type:"Short"}
  ]},
  {id:"math9-geo-triangles", class:9, subject:"Maths", strand:"Geometry", chapter:"Triangles – Congruence", title:"SSS, SAS, ASA, RHS", notes:"Criteria to prove triangles congruent.", questions:[
    {q:"State SAS criterion.", a:"Two sides and the included angle equal.", level:"Medium", type:"Short"},
  ]},

  // SCIENCE – Physics/Chemistry/Biology
  {id:"sci7-phys-motion", class:7, subject:"Science", strand:"Physics", chapter:"Motion", title:"Speed, Velocity, Uniform motion", notes:"Speed = distance/time; velocity has direction.", questions:[
    {q:"120 km in 3 h → speed?", a:"40 km/h", level:"Easy", type:"MCQ", tags:["numerical"]},
    {q:"Differentiate speed & velocity.", a:"Speed: scalar; Velocity: vector.", level:"Medium", type:"Short"}
  ]},
  {id:"sci10-phys-ohm", class:10, subject:"Science", strand:"Physics", chapter:"Electricity – Ohm's Law", title:"V = IR", notes:"V ∝ I at constant temperature.", questions:[
    {q:"6 V gives 2 A → R?", a:"3 Ω", level:"Easy", type:"MCQ", tags:["important","numerical"]},
  ]},
  {id:"sci8-chem-matter", class:8, subject:"Science", strand:"Chemistry", chapter:"Matter & States", title:"Solid/Liquid/Gas, Diffusion", notes:"Particles move; heating increases energy.", questions:[
    {q:"Define diffusion with example.", a:"Perfume spreading in a room.", level:"Easy", type:"Short"}
  ]},
  {id:"sci9-bio-cell", class:9, subject:"Science", strand:"Biology", chapter:"Cell", title:"Organelles & functions", notes:"Nucleus control, mitochondria energy.", questions:[
    {q:"Three organelles & functions.", a:"Nucleus-control, Mitochondria-energy, Ribosome-protein synthesis.", level:"Easy", type:"Short"}
  ]},

  // SST – History/Geography/Civics/Economics
  {id:"sst8-hist-revolt1857", class:8, subject:"SST", strand:"History", chapter:"Revolt of 1857", title:"Causes & Impact", notes:"Political, economic, military causes; results.", questions:[
    {q:"Name two political causes.", a:"Doctrine of Lapse; annexations.", level:"Medium", type:"Short", tags:["important"]}
  ]},
  {id:"sst9-geo-climate", class:9, subject:"SST", strand:"Geography", chapter:"Climate of India", title:"Monsoon Mechanism", notes:"Differential heating, ITCZ, jet streams, ELNINO.", questions:[
    {q:"Define monsoon.", a:"Seasonal reversal of winds.", level:"Easy", type:"Short"}
  ]},
  {id:"sst10-civics-democracy", class:10, subject:"SST", strand:"Civics", chapter:"Democracy & Diversity", title:"Accommodation & Representation", notes:"Power-sharing, federalism, consociationalism (basic).", questions:[
    {q:"Why power sharing?", a:"Prevents conflict, ensures stability.", level:"Medium", type:"Short"}
  ]},
];

// ---------- State ----------
const state = {
  q: "",
  class: "",
  subject: "",
  strand: "",
  level: "",
  bookmarks: JSON.parse(localStorage.getItem(LS_BOOKMARKS) || "[]"),
  notes: localStorage.getItem(LS_NOTES) || "",
  theme: localStorage.getItem(LS_THEME) || "dark"
};

// ---------- DOM ----------
const el = (sel) => document.querySelector(sel);
const cardsEl = el('#cards');

// Fill selects
(function initFilters(){
  const classSel = el('#class');
  CLASSES.forEach(c=>{const o=document.createElement('option'); o.value=String(c); o.textContent=`Class ${c}`; classSel.appendChild(o);});
  const strandSel = el('#strand');
  STRANDS.forEach(s=>{const o=document.createElement('option'); o.textContent=s; strandSel.appendChild(o);});
})();

// Theme
(function initTheme(){
  const root = document.documentElement;
  if(state.theme === 'light') root.classList.add('light');
  el('#btn-theme').addEventListener('click',()=>{
    root.classList.toggle('light');
    state.theme = root.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem(LS_THEME, state.theme);
    el('#btn-theme').textContent = state.theme==='light' ? '🌙' : '☀️';
  });
  el('#btn-theme').textContent = state.theme==='light' ? '🌙' : '☀️';
})();

// Notes
(function initNotes(){
  el('#mynotes').value = state.notes;
  el('#save-notes').onclick = ()=>{ state.notes = el('#mynotes').value; localStorage.setItem(LS_NOTES, state.notes); toast('Notes saved'); };
  el('#clear-notes').onclick = ()=>{ el('#mynotes').value=''; };
  el('#copy-notes').onclick = async ()=>{ try{ await navigator.clipboard.writeText(el('#mynotes').value); toast('Copied'); }catch{}}
})();

// Print
el('#btn-print').onclick = ()=> window.print();

// Back to top
el('#scroll-top').onclick = (e)=>{ e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); };

// Year
el('#year').textContent = new Date().getFullYear();

// Search & Filters
['q','class','subject','strand','level'].forEach(id=>{
  el('#'+id).addEventListener('input',()=>{ state[id] = el('#'+id).value; render(); });
});
el('#reset').onclick = ()=>{
  ['q','class','subject','strand','level'].forEach(id=>{ el('#'+id).value = ""; state[id]=""; });
  render();
};

// Export/Import
el('#export-json').onclick = ()=>{
  const blob = new Blob([JSON.stringify(CONTENT,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='studyhub-sample.json'; a.click(); URL.revokeObjectURL(url);
};
el('#import-json').addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{ try{ const data = JSON.parse(reader.result); if(Array.isArray(data)){ CONTENT = data; render(); toast('Data imported'); } }catch{ toast('Invalid JSON'); } };
  reader.readAsText(file);
});

// Chat (rule-based demo)
const KB = [
  {k:['ohm','v = ir','ohms law'], a:"Ohm's Law: V = I × R. At constant temperature, current is directly proportional to voltage."},
  {k:['speed formula','velocity'], a:"Speed = distance/time. Velocity is speed with direction."},
  {k:['triangle congruence','sss','sas','asa','rhs'], a:"Triangle congruence criteria: SSS, SAS, ASA, RHS."},
  {k:['monsoon','climate of india'], a:"Monsoon: seasonal reversal of winds due to differential heating, ITCZ shift, and jet streams."}
];
function chatAnswer(q){
  const t = q.toLowerCase();
  const hit = KB.find(x=>x.k.some(k=>t.includes(k)));
  if(hit) return hit.a;
  // fallback: search CONTENT notes & questions
  const any = CONTENT.find(item=> (item.notes+item.title+item.chapter).toLowerCase().includes(t) || item.questions.some(qa=> (qa.q+qa.a).toLowerCase().includes(t)) );
  if(any) return `Try this topic: Class ${any.class} • ${any.subject} • ${any.chapter} — ${any.title}`;
  return "I don't know yet. Try different words or import more data.";
}
(function initChat(){
  const log = el('#chat-log');
  const input = el('#chat-input');
  const send = el('#chat-send');
  function push(role, text){
    const p=document.createElement('div'); p.className='chat-msg'; p.innerHTML = `<strong class="${role}">${role==='me'?'You':'Bot'}:</strong> ${escapeHtml(text)}`; log.appendChild(p); log.scrollTop = log.scrollHeight;
  }
  function go(){ const v = input.value.trim(); if(!v) return; push('me', v); push('bot', chatAnswer(v)); input.value=''; }
  send.onclick = go; input.addEventListener('keydown', e=>{ if(e.key==='Enter') go(); });
  push('bot','Hi! Ask about formulas or topics.');
})();

// ---------- Render ----------
function render(){
  const q = (state.q||'').toLowerCase();
  const list = CONTENT.filter(it=>{
    if(state.class && String(it.class)!==String(state.class)) return false;
    if(state.subject && it.subject!==state.subject) return false;
    if(state.strand && it.strand!==state.strand) return false;
    if(state.level && !it.questions.some(qa=> qa.level===state.level)) return false;
    if(q){
      const hay = `${it.title} ${it.chapter} ${it.notes} ${it.subject} ${it.strand} ${it.questions.map(x=>x.q+" "+x.a).join(" ")}`.toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });

  // Stats
  el('#stats').textContent = `${list.length} result${list.length!==1?'s':''}`;

  // Cards
  cardsEl.innerHTML = '';
  if(list.length===0){
    const empty = document.createElement('div');
    empty.className='card';
    empty.innerHTML = `<div class="card-body"><p class="muted">No results. Try changing filters or search.</p></div>`;
    cardsEl.appendChild(empty); return;
  }

  const tpl = el('#card-tpl');
  list.forEach(item=>{
    const node = tpl.content.cloneNode(true);
    node.querySelector('.badge.class').textContent = `Class ${item.class}`;
    node.querySelector('.badge.subject').textContent = item.subject;
    node.querySelector('.badge.strand').textContent = item.strand;
    node.querySelector('.title').textContent = item.title;
    node.querySelector('.notes').textContent = item.chapter+" — "+item.notes;

    const qa = node.querySelector('.qa');
    item.questions.forEach((qaItem, i)=>{
      const li=document.createElement('li');
      li.innerHTML = `
        <div class="meta">
          <span class="badge">${qaItem.level}</span>
          <span class="badge" style="background:rgba(124,229,176,.15);border-color:rgba(124,229,176,.35);color:#c9f6df">${qaItem.type}</span>
          ${(qaItem.tags||[]).map(t=>`<span class="badge">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div><strong>Q${i+1}.</strong> ${escapeHtml(qaItem.q)}</div>
        <div class="ans"><strong>Ans:</strong> ${escapeHtml(qaItem.a)}</div>`;
      qa.appendChild(li);
    });

    // Bookmark
    const b = node.querySelector('.bookmark');
    const isBm = state.bookmarks.includes(item.id);
    b.textContent = isBm ? '★' : '☆';
    b.onclick = ()=> toggleBookmark(item.id);

    cardsEl.appendChild(node);
  });

  renderBookmarks();
}

function renderBookmarks(){
  const host = el('#bookmarks');
  if(state.bookmarks.length===0){ host.textContent = 'No bookmarks yet.'; return; }
  host.innerHTML = '';
  state.bookmarks.map(id=> CONTENT.find(x=>x.id===id)).filter(Boolean).forEach(item=>{
    const div=document.createElement('div');
    div.className='chip-item';
    div.innerHTML = `<span>★ Class ${item.class} • ${item.subject} • ${escapeHtml(item.chapter)}</span> <button class="btn ghost sm">Remove</button>`;
    div.querySelector('button').onclick = ()=> toggleBookmark(item.id);
    host.appendChild(div);
  });
}

function toggleBookmark(id){
  const i = state.bookmarks.indexOf(id);
  if(i>=0) state.bookmarks.splice(i,1); else state.bookmarks.push(id);
  localStorage.setItem(LS_BOOKMARKS, JSON.stringify(state.bookmarks));
  render();
}

// ---------- Utils ----------
function toast(text){
  const t=document.createElement('div'); t.textContent=text; t.style.position='fixed'; t.style.bottom='20px'; t.style.left='50%'; t.style.transform='translateX(-50%)'; t.style.padding='10px 14px'; t.style.background='rgba(0,0,0,.75)'; t.style.color='#fff'; t.style.borderRadius='10px'; t.style.zIndex='9999'; document.body.appendChild(t); setTimeout(()=>t.remove(),1400);
}
function escapeHtml(s){ return s.replace(/[&<>"]+/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m])); }

// ---------- Start ----------
render();
