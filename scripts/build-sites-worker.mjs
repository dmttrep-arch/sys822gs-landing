import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = await readFile(join(root, "index.html"), "utf8");
const catalogText = await readFile(join(root, "catalog.json"), "utf8");
const catalog = JSON.parse(catalogText);
if (!Array.isArray(catalog.products) || catalog.products.length !== 39) {
  throw new Error("Catalog must contain exactly 39 products");
}
const page = source.replace(/src="hero\.png"/g,'src="https://cdn.jsdelivr.net/gh/dmttrep-arch/sys822gs-landing@gh-pages/hero.png"');
const serverDir = join(root, "dist", "server");
await mkdir(serverDir, { recursive: true });
await writeFile(join(serverDir, "index.js"), `const PAGE=${JSON.stringify(page)};
const CATALOG=${JSON.stringify(catalog)};
const PRODUCTS=new Map(CATALOG.products.map(p=>[p.id,p]));
const headers={"content-type":"application/json; charset=utf-8","cache-control":"no-store"};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const clean=(value,max)=>String(value||"").trim().slice(0,max);
const money=(n,decimals)=>n==null?"По запросу":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:decimals??(Number.isInteger(n)?0:2),maximumFractionDigits:2}).format(n);
export default{async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==="/catalog.json"&&request.method==="GET")return new Response(JSON.stringify(CATALOG),{headers:{"content-type":"application/json; charset=utf-8","cache-control":"public, max-age=300"}});
  if(url.pathname==="/api/lead"){
    if(request.method!=="POST")return json({ok:false,error:"method_not_allowed"},405);
    let data;try{data=await request.json()}catch{return json({ok:false,error:"invalid_json"},400)}
    const name=clean(data?.name,120),company=clean(data?.company,160),contact=clean(data?.contact,160),email=clean(data?.email,160),message=clean(data?.message,2000);
    if(!name||!company||!contact)return json({ok:false,error:"required_fields"},400);
    if(!Array.isArray(data?.items)||!data.items.length||data.items.length>50)return json({ok:false,error:"invalid_items"},400);
    const items=[];for(const row of data.items){const product=PRODUCTS.get(String(row?.productId||""));const quantity=Number(row?.quantity);if(!product||!Number.isInteger(quantity)||quantity<1||quantity>999)return json({ok:false,error:"invalid_item"},400);items.push({product,quantity})}
    if(!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID)return json({ok:false,error:"service_not_configured"},503);
    const requestId="MIL-"+Date.now().toString(36).toUpperCase();
    const lines=items.map(({product,quantity},i)=>(i+1)+". "+product.title+"\\n   Количество: "+quantity+"\\n   Цена: "+money(product.priceUsd,product.priceDecimals));
    const text=["Новая заявка · HK MILONCHKA LIMITED","Номер: "+requestId,"","Имя: "+name,"Компания: "+company,"Контакт: "+contact,"Email: "+(email||"—"),"Комментарий: "+(message||"—"),"","Оборудование:",...lines,"","Цены — ориентиры в USD. Комплектация и условия требуют подтверждения."].join("\\n");
    let response;try{response=await fetch("https://api.telegram.org/bot"+env.TELEGRAM_BOT_TOKEN+"/sendMessage",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text,disable_web_page_preview:true}),signal:AbortSignal.timeout(10000)})}catch{return json({ok:false,error:"delivery_failed"},502)}
    if(!response.ok)return json({ok:false,error:"delivery_failed"},502);
    return json({ok:true,requestId});
  }
  if(request.method!=="GET"&&request.method!=="HEAD")return new Response("Method not allowed",{status:405});
  return new Response(request.method==="HEAD"?null:PAGE,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"public, max-age=300","content-security-policy":"default-src 'self'; img-src 'self' https://cdn.jsdelivr.net data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'","referrer-policy":"strict-origin-when-cross-origin","x-content-type-options":"nosniff","x-frame-options":"DENY"}});
}}`, "utf8");
await mkdir(join(root, "dist", ".openai"), { recursive: true });
await writeFile(join(root, "dist", ".openai", "hosting.json"), await readFile(join(root, ".openai", "hosting.json"), "utf8"), "utf8");
