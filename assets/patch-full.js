(() => {
  'use strict';
  if (typeof CRS_FAMILIES === 'undefined') return;
  const NCRS=CRS_FAMILIES.flatMap(f=>f.entries.map(c=>({...c,family:f.id,familyLabel:f.label})));
  const NCRSMAP=Object.fromEntries(NCRS.map(c=>[c.code,c]));
  const NFAMILYMAP=Object.fromEntries(CRS_FAMILIES.map(f=>[f.id,f]));
  const nFamilyOptions=selected=>CRS_FAMILIES.map(f=>`<option value="${f.id}" ${f.id===selected?'selected':''}>${f.label}</option>`).join('');
  const nVariantOptions=(familyId,selected)=>{let f=NFAMILYMAP[familyId]||CRS_FAMILIES[0];return f.entries.map(c=>`<option value="${c.code}" ${c.code===selected?'selected':''}>${c.variant} — ${c.code}</option>`).join('')};
  function nGet(side){let fid=document.getElementById(`cc${side}Family`)?.value,code=document.getElementById(`cc${side}Variant`)?.value;return NCRSMAP[code]||NFAMILYMAP[fid]?.entries[0]}
  function nPopulate(side,preferred){let fs=document.getElementById(`cc${side}Family`),vs=document.getElementById(`cc${side}Variant`);if(!fs||!vs)return;let f=NFAMILYMAP[fs.value]||CRS_FAMILIES[0],keep=preferred&&f.entries.some(c=>c.code===preferred)?preferred:f.entries[0].code;vs.innerHTML=nVariantOptions(f.id,keep);vs.value=keep}
  function nSet(side,fid,code){let fs=document.getElementById(`cc${side}Family`),vs=document.getElementById(`cc${side}Variant`);fs.value=fid;nPopulate(side,code);vs.value=code}
  function nLabels(c){return c.type==='geo'?['Longitude (decimal °)','Latitude (decimal °)']:['Easting (m)','Northing (m)']}

  if(typeof GRID_FILES!=='undefined'){
    GRID_FILES.gdaChristmas={name:'GDA94_GDA2020_conformal_christmas_island.gsb',epsg:'7998',urls:['https://s3-ap-southeast-2.amazonaws.com/transformation-grids/GDA94_GDA2020_conformal_christmas_island.gsb','https://raw.githubusercontent.com/icsm-au/transformation_grids/master/GDA94_GDA2020_conformal_christmas_island.gsb']};
    GRID_FILES.gdaCocos={name:'GDA94_GDA2020_conformal_cocos_island.gsb',epsg:'7999',urls:['https://s3-ap-southeast-2.amazonaws.com/transformation-grids/GDA94_GDA2020_conformal_cocos_island.gsb','https://raw.githubusercontent.com/icsm-au/transformation_grids/master/GDA94_GDA2020_conformal_cocos_island.gsb']};
  }
  const originalDatumTransform = typeof datumTransformGrid==='function' ? datumTransformGrid : null;
  if(originalDatumTransform){
    datumTransformGrid=async function(coord,fromD,toD,mode){
      const is94to20=(fromD==='gda94'&&toD==='gda2020')||(fromD==='gda2020'&&toD==='gda94');
      if(is94to20){
        const [lon,lat]=coord; let key=null;
        if(lon>104&&lon<107&&lat>-12&&lat<-9)key='gdaChristmas';
        else if(lon>95&&lon<98&&lat>-14&&lat<-10)key='gdaCocos';
        if(key){let used=[];let out=await gridStep(coord,fromD,toD,key,used);return{coord:out,used};}
      }
      return originalDatumTransform(coord,fromD,toD,mode);
    };
  }

  let nRun=0;
  async function convertCoord2(){
    const run=++nRun,from=nGet('From'),to=nGet('To'),x=parseFloat(document.getElementById('ccX')?.value),y=parseFloat(document.getElementById('ccY')?.value),mode=document.getElementById('ccMode')?.value||'distortion',r=document.getElementById('ccResult'),st=document.getElementById('ccStatus');
    if(!from||!to||!r||!st)return;
    if(!Number.isFinite(x)||!Number.isFinite(y)){r.innerHTML=box('Result','Enter valid coordinates');return;}
    try{
      if(from.datum!==to.datum){st.className='status';st.innerHTML='<span class="loadingLine"><span class="dot"></span> Loading official transformation grid if required…</span>';}
      const srcGeo=proj4(projectionOnly(from),rawLonglat(from.datum),[x,y]);
      const transformed=await datumTransformGrid(srcGeo,from.datum,to.datum,mode); if(run!==nRun)return;
      const out=proj4(rawLonglat(to.datum),projectionOnly(to),transformed.coord),notes=[];
      if(transformed.used.length)notes.push(`<strong>Official NTv2:</strong> ${[...new Set(transformed.used)].join(' → ')}`);else notes.push('Same-datum projection conversion: no datum grid required.');
      if((from.datum==='wgs84'||to.datum==='wgs84')&&from.datum!==to.datum)notes.push('WGS84 is dynamic. This tool treats WGS84 as approximately coincident with GDA2020 at epoch 2020.0; use epoch-aware coordinates for centimetre GNSS work.');
      if(from.code.startsWith('NSW:ISG')||to.code.startsWith('NSW:ISG'))notes.push('NSW ISG uses the NSW Spatial Services definition: 2° zones, k₀ 0.99994, false E 300,000 m, false N 5,000,000 m on AGD66/ANS.');
      if(from.code.startsWith('LANDGATE:')||to.code.startsWith('LANDGATE:'))notes.push('Legacy WA project-grid parameters are Landgate AGD84 definitions; datum conversion uses the official AGD84↔GDA94 NTv2 grid.');
      if((from.datum==='gda94'||to.datum==='gda94'||['agd66','agd84'].includes(from.datum)||['agd66','agd84'].includes(to.datum))&&from.datum!==to.datum){
        const island=transformed.used.some(u=>u.includes('christmas_island')||u.includes('cocos_island'));
        notes.push(island?'External territory conversion uses the dedicated ICSM island conformal grid.':(mode==='distortion'?'GDA94↔GDA2020: conformal + distortion (survey / ground control).':'GDA94↔GDA2020: conformal only (GNSS / geocentric).'));
      }
      if(to.type==='geo')r.innerHTML=box('Longitude',`${out[0].toFixed(9)}°`)+box('Latitude',`${out[1].toFixed(9)}°`)+box('Longitude DMS',dmsLon(out[0]))+box('Latitude DMS',dmsLat(out[1]));
      else r.innerHTML=box('Easting',`${out[0].toFixed(3)} m`)+box('Northing',`${out[1].toFixed(3)} m`)+box('Target CRS',to.code)+box('Datum',DATUMS[to.datum].label);
      st.className='status good';st.innerHTML=notes.join('<br>');
    }catch(e){if(run!==nRun)return;r.innerHTML=box('Conversion error','Transformation could not be applied');st.className='status warn';st.textContent=e?.message||'Unable to transform this coordinate.';}
  }
  function setupCoordConverter2(){const from=nGet('From'),to=nGet('To');if(!from||!to)return;const[lx,ly]=nLabels(from);document.getElementById('ccXLab').textContent=lx;document.getElementById('ccYLab').textContent=ly;document.getElementById('ccFromMeta').innerHTML=`<small>Source</small><strong>${from.name}</strong><div class="smallNote">${from.code} · ${from.familyLabel}</div>`;document.getElementById('ccToMeta').innerHTML=`<small>Target</small><strong>${to.name}</strong><div class="smallNote">${to.code} · ${to.familyLabel}</div>`;convertCoord2();}
  async function swapCRS2(){const from=nGet('From'),to=nGet('To'),x=document.getElementById('ccX'),y=document.getElementById('ccY'),mode=document.getElementById('ccMode')?.value||'distortion',xi=parseFloat(x?.value),yi=parseFloat(y?.value);try{if(!from||!to||!Number.isFinite(xi)||!Number.isFinite(yi))throw new Error('Enter valid coordinates first.');const src=proj4(projectionOnly(from),rawLonglat(from.datum),[xi,yi]),tr=await datumTransformGrid(src,from.datum,to.datum,mode),out=proj4(rawLonglat(to.datum),projectionOnly(to),tr.coord);nSet('From',to.family,to.code);nSet('To',from.family,from.code);x.value=out[0].toFixed(to.type==='geo'?9:3);y.value=out[1].toFixed(to.type==='geo'?9:3);setupCoordConverter2();}catch(e){const s=document.getElementById('ccStatus');if(s){s.className='status warn';s.textContent=e?.message||'Unable to swap systems.';}}}

  const oldOpen=window.openTool || openTool;
  window.openTool=function(k){
    if(k!=='coordconv')return oldOpen(k);
    const a=document.getElementById('calcArea');
    a.innerHTML=`<div class="calc active"><button class="close" id="ccClose">← Close</button><h2>Australian Coordinate Converter <span class="crsCount">${NCRS.length} verified variants</span></h2><p class="notice">Choose the coordinate-system family first, then its zone or grid.</p><div class="calcLayout"><section class="card"><h3>From</h3><div class="selectField"><label for="ccFromFamily">Coordinate system</label><select id="ccFromFamily">${nFamilyOptions('mga94')}</select></div><div class="selectField" style="margin-top:10px"><label for="ccFromVariant">Zone / grid</label><select id="ccFromVariant">${nVariantOptions('mga94','EPSG:28351')}</select></div><button class="swapBtn" id="ccSwap">⇅ Swap from / to</button><h3 style="margin-top:20px">To</h3><div class="selectField"><label for="ccToFamily">Coordinate system</label><select id="ccToFamily">${nFamilyOptions('mga2020')}</select></div><div class="selectField" style="margin-top:10px"><label for="ccToVariant">Zone / grid</label><select id="ccToVariant">${nVariantOptions('mga2020','EPSG:7851')}</select></div><div class="selectField" style="margin-top:14px"><label for="ccMode">GDA94 ↔ GDA2020 transformation</label><select id="ccMode"><option value="distortion">Survey / ground control — conformal + distortion</option><option value="conformal">GNSS / geocentric — conformal only</option></select></div><div class="coordPanel"><div class="formGrid"><div class="field"><label id="ccXLab" for="ccX">Easting (m)</label><input id="ccX" type="number" step="any" value="400000"></div><div class="field"><label id="ccYLab" for="ccY">Northing (m)</label><input id="ccY" type="number" step="any" value="6800000"></div></div></div><div class="coordMeta"><div class="metaBox" id="ccFromMeta"></div><div class="metaBox" id="ccToMeta"></div></div><p class="smallNote"><strong>Horizontal coordinates only.</strong> Datum shifts use official ICSM NTv2 grids where applicable. Legacy/local grid definitions should still be checked against project requirements before control work.</p><div class="sourceNote">${NCRS.length} selectable variants: EPSG systems, NSW ISG and legacy Landgate AGD84 WA project grids.</div></section><aside class="card"><h3>Converted coordinate</h3><div class="resultGrid wideResults" id="ccResult"></div><div id="ccStatus" class="status"></div></aside></div></div>`;
    document.getElementById('ccClose').addEventListener('click',()=>a.innerHTML='');
    ['From','To'].forEach(side=>{document.getElementById(`cc${side}Family`).addEventListener('change',()=>{nPopulate(side);setupCoordConverter2();});document.getElementById(`cc${side}Variant`).addEventListener('change',setupCoordConverter2);});
    document.getElementById('ccMode').addEventListener('change',setupCoordConverter2);document.getElementById('ccSwap').addEventListener('click',swapCRS2);['ccX','ccY'].forEach(id=>document.getElementById(id).addEventListener('input',convertCoord2));setupCoordConverter2();a.scrollIntoView({behavior:'smooth',block:'start'});
  };
  window.swapCRS2=swapCRS2;
  window.MSTCoordinateCatalogue={count:NCRS.length,families:CRS_FAMILIES.length};
})();
