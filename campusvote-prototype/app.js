const positions = [
  { name: "President", candidates: [
    {id:"p1",name:"Hilary wekesa",initials:"WH",tagline:"Leadership through action",color:"",manifesto:"Prioritising student welfare, transparent representation, and stronger links between students and university leadership."},
    {id:"p2",name:"Hibravon wells",initials:"HR",tagline:"A campus that listens",color:"rose",manifesto:"Building a responsive student union with open forums, better communication, and accountable leadership."},
    {id:"p3",name:"Trevor crilington",initials:"TC",tagline:"Together we can do more",color:"greenish",manifesto:"Championing inclusive campus activities, student innovation, and practical support for every school."}
  ]},
  { name: "Vice President", candidates: [
    {id:"v1",name:"ESTHER KWAMBOKA",initials:"KW",tagline:"Service with purpose",color:"gold",manifesto:"Supporting student clubs, improving coordination, and making campus services easier to access."},
    {id:"v2",name:"ANNE DEAR",initials:"AD",tagline:"Every student counts",color:"rose",manifesto:"Promoting inclusion, stronger peer support, and regular student feedback sessions."},
    {id:"v3",name:"ANGEL BRIGHT",initials:"AB",tagline:"Ideas into action",color:"greenish",manifesto:"Helping student initiatives move from proposals to achievable, measurable projects."}
  ]},
  { name: "Secretary", candidates: [
    {id:"s1",name:"Ivan awes",initials:"IA",tagline:"Clear. Open. Accountable.",color:"rose",manifesto:"Publishing meeting summaries, improving access to union information, and keeping records organised."},
    {id:"s2",name:"VIN bear",initials:"VB",tagline:"Communication you can trust",color:"",manifesto:"Making student leadership updates timely, accessible, and easy to understand."},
    {id:"s3",name:"Mercy AIJY",initials:"MJ",tagline:"Your voice, documented",color:"greenish",manifesto:"Creating clear feedback channels and transparent follow-up on student concerns."}
  ]},
  { name: "Treasurer", candidates: [
    {id:"t1",name:"Isaac masila",initials:"MIM",tagline:"Every shilling matters",color:"gold",manifesto:"Advocating for clear budgets, regular financial summaries, and responsible use of student funds."},
    {id:"t2",name:"Grace Kamau",initials:"GA",tagline:"Transparency by default",color:"greenish",manifesto:"Promoting accessible financial reporting and clear explanations of spending priorities."},
    {id:"t3",name:"Fransisah njeri",initials:"SK",tagline:"Accountability in action",color:"",manifesto:"Supporting practical budget planning and independent review of student-union expenditure."}
  ]}
];

const selections = {};
const views = ["dashboard","ballot","candidates","results"];
const names = {dashboard:"Dashboard",ballot:"Cast your vote",candidates:"Candidates",results:"Results preview"};
const $ = (selector, parent=document) => parent.querySelector(selector);
const $$ = (selector, parent=document) => [...parent.querySelectorAll(selector)];

function allCandidates(){ return positions.flatMap(position => position.candidates.map(candidate => ({...candidate, position:position.name}))); }
function candidateCard(candidate, mode="ballot") {
  const selected = selections[candidate.position] === candidate.id;
  return `<article class="candidate-card ${selected && mode==="ballot" ? "selected":""}" ${mode==="ballot" ? `data-select="${candidate.id}" data-position="${candidate.position}" tabindex="0" role="radio" aria-checked="${selected}"` : ""}>
    <div class="candidate-top"><div class="candidate-photo ${candidate.color}">${candidate.initials}</div><div><div class="candidate-name">${candidate.name}</div><div class="candidate-sub">${candidate.tagline}</div></div></div>
    <p>${candidate.manifesto}</p>
    ${mode==="ballot" ? `<div class="candidate-select"><span>${selected?"Selected":"Select candidate"}</span><span class="radio-dot"></span></div>` : `<div class="candidate-select"><span>${candidate.position}</span><span>Profile ↗</span></div>`}
  </article>`;
}
function renderBallot(){
  $("#ballot-positions").innerHTML = positions.map(position => `<section class="position-block"><div class="position-head"><h2>${position.name}</h2><span>Choose one</span></div><div class="candidate-grid">${position.candidates.map(candidate => candidateCard({...candidate,position:position.name})).join("")}</div></section>`).join("");
  updateProgress();
}
function updateProgress(){
  const count = Object.keys(selections).length;
  $("#selection-count").textContent = `${count} of ${positions.length} positions selected`;
  $("#progress-stat").innerHTML = `${count} <em>/ ${positions.length}</em>`;
  $("#review-ballot").disabled = count !== positions.length;
}
function renderDirectory(){
  const filter = $("#position-filter").value;
  const candidates = allCandidates().filter(c => filter==="all" || c.position===filter);
  $("#candidate-directory").innerHTML = candidates.map(c=>candidateCard(c,"directory")).join("");
  $("#candidate-directory").classList.add("directory");
}
function renderResults(){
  const sample = [
    {position:"President",rows:[["AN","Amina Njoroge",46],["BM","Brian Mwangi",33],["FC","Faith Chebet",21]]},
    {position:"Vice President",rows:[["LW","Lydia Wanjiku",42],["KO","Kevin Otieno",35],["MK","Mark Kiptoo",23]]},
    {position:"Secretary",rows:[["SA","Sheila Atieno",51],["DM","Daniel Maina",29],["MJ","Mercy Jepkoech",20]]},
    {position:"Treasurer",rows:[["GA","Grace Achieng",44],["PK","Peter Kamau",34],["SK","Samuel Kiplangat",22]]}
  ];
  $("#results-grid").innerHTML = sample.map(item=>`<article class="result-card"><span class="sample-tag">ILLUSTRATIVE DATA</span><h2>${item.position}</h2><p class="muted">Sample vote distribution</p>${item.rows.map(row=>`<div class="result-row"><div class="result-avatar">${row[0]}</div><div class="result-person"><strong>${row[1]}</strong><div class="result-track"><span style="width:${row[2]}%"></span></div></div><span class="result-percent">${row[2]}%</span></div>`).join("")}</article>`).join("");
}
function showView(view){
  views.forEach(v=>$("#view-"+v).classList.toggle("active",v===view));
  $$(".nav-item").forEach(button=>button.classList.toggle("active",button.dataset.view===view));
  $("#breadcrumb-current").textContent=names[view];
  if(view==="ballot") renderBallot();
  if(view==="candidates") renderDirectory();
  window.scrollTo({top:0,behavior:"smooth"});
}
function toast(message){
  const node=$("#toast"); node.textContent=message; node.classList.add("show");
  clearTimeout(toast.timer); toast.timer=setTimeout(()=>node.classList.remove("show"),3000);
}
function chooseCandidate(card){
  const position=card.dataset.position, id=card.dataset.select;
  if(!position || !id) return;
  selections[position]=id; renderBallot();
  toast(`${position} selection updated.`);
}
function openReview(){
  if(Object.keys(selections).length!==positions.length) return;
  $("#review-list").innerHTML=positions.map(position=>{
    const candidate=position.candidates.find(c=>c.id===selections[position.name]);
    return `<div class="review-item"><span>${position.name}</span><strong>${candidate.name}</strong></div>`;
  }).join("");
  $("#review-dialog").showModal();
}

document.addEventListener("click", event=>{
  const nav=event.target.closest("[data-view]");
  const go=event.target.closest("[data-go]");
  const card=event.target.closest("[data-select]");
  if(nav) showView(nav.dataset.view);
  if(go) showView(go.dataset.go);
  if(card) chooseCandidate(card);
});
document.addEventListener("keydown",event=>{
  const card=event.target.closest("[data-select]");
  if(card && (event.key==="Enter" || event.key===" ")){event.preventDefault();chooseCandidate(card);}
});
$("#position-filter").addEventListener("change",renderDirectory);
$("#review-ballot").addEventListener("click",openReview);
$("#edit-ballot").addEventListener("click",()=>$("#review-dialog").close());
$("#confirm-ballot").addEventListener("click",()=>{
  $("#review-dialog").close();
  $("#view-ballot").innerHTML=`<div class="success-state" style="max-width:650px;margin:55px auto;text-align:center;background:white;border:1px solid #e9edf5;border-radius:18px;padding:40px 24px;box-shadow:var(--shadow)"><div style="width:62px;height:62px;display:grid;place-items:center;margin:0 auto 20px;border-radius:50%;background:#e0f8ed;color:#15996a;font-size:30px">✓</div><p class="eyebrow">DEMO COMPLETE</p><h1 style="font-size:27px">Your demo ballot is confirmed</h1><p class="muted" style="max-width:420px;margin:0 auto 23px">This confirms only the prototype interaction. No vote was sent to a server or recorded in an election database.</p><div style="background:#f6f8fc;border-radius:11px;padding:15px;margin-bottom:22px;text-align:left"><strong style="font-size:11px">Next step</strong><p style="font-size:11px;color:#7c8499;margin:6px 0 0">Connect Supabase and implement server-enforced eligibility, ballot privacy, and duplicate-vote prevention before treating this as a real voting system.</p></div><button class="button button-primary" id="back-dashboard">Return to dashboard →</button></div>`;
  $("#back-dashboard").addEventListener("click",()=>location.reload());
});
renderBallot();renderDirectory();renderResults();
