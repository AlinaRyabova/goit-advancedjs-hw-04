import{S as M,i as m,a as S}from"./assets/vendor-aa7a424a.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();const l={baseUrl:"https://pixabay.com/api/",key:"40817348-8cf9cc617061525653a12724b",image_type:"photo",orientation:"horizontal",safesearch:"true",order:"popular",page:"1",per_page:"40"},b=document.querySelector(".search-form"),p=document.querySelector(".gallery"),n=document.querySelector(".load-more"),d={markup:"",htmlCode:""};let u="",v="",c=1;const L=new M(".gallery a",{enableKeyboard:!0});b.addEventListener("submit",async s=>{s.preventDefault();const{elements:{searchQuery:r}}=s.target;if(u=r.value.trim(),u===""){p.innerHTML="",m.error({title:"Error",message:"Sorry, there are no images matching your search query. Please try again."});return}u!==v?(c=1,l.page=`${c}`,p.innerHTML="",n.classList.remove("is-visible")):(c+=1,l.page=`${c}`,n.classList.remove("is-visible")),v=u;try{const a=await $(u);d.htmlCode=await w(a),p.insertAdjacentHTML("beforeend",d.htmlCode),L.refresh();const{page:o,per_page:e}=l,{totalHits:t}=a,i=Math.ceil(t/e);o<=i&&n.classList.remove("is-visible"),m.success({title:"Success",message:`Hooray! We found ${t} images.`})}catch{n.classList.add("is-visible"),m.error({title:"Error",message:"Sorry, there are no images matching your search query. Please try again."})}finally{b.reset()}});n.addEventListener("click",async()=>{c+=1,l.page=`${c}`;try{const s=await $(u);d.htmlCode=await w(s),p.insertAdjacentHTML("beforeend",d.htmlCode),n.classList.add("is-visible"),L.refresh();const{page:r,per_page:a}=l,{totalHits:o}=s,e=Math.ceil(o/a);r<=e&&n.classList.remove("is-visible")}catch{m.error({title:"Error",message:"We're sorry, but you've reached the end of search results."})}});async function $(s){const{baseUrl:r,key:a,image_type:o,orientation:e,safesearch:t,order:i,page:f,per_page:g}=l;l.page=`${c}`;const y=(await S.get(`${r}?key=${a}&q=${s}&image_type=${o}&orientation=${e}&safesearch=${t}&order=${i}&page=${f}&per_page=${g}`)).data,{totalHits:h}=y,k=Math.ceil(h/g);if(h===0)throw new Error;return f>k&&m.error({title:"Error",message:"We're sorry, but you've reached the end of search results."}),y}async function w(s){return d.markup=s.hits.map(r=>`<a href="${r.largeImageURL}" class="card-link js-card-link" ><div class="photo-card">
        <img src="${r.webformatURL}" alt="${r.tags}" loading="lazy"
        class="photo"/>
        <div class="info">
    <p class="info-item">
      <b>Likes:</b>${r.likes}
    </p>
    <p class="info-item">
      <b>Views:</b>${r.views}
    </p>
    <p class="info-item">
      <b>Comments:</b>${r.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>${r.downloads}
    </p>
  </div>
</div></a>`).join(""),d.markup}
//# sourceMappingURL=commonHelpers.js.map
