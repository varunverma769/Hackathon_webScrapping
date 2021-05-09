const puppy = require("puppeteer");
const fs = require("fs");
// const id ="";
// const password = "";

    async function main() {
        let browser =  await puppy.launch({
                headless: false,
                defaultViewport: false
        });

        let tabs = await browser.pages();
        let tab = tabs[0];
        await tab.goto("https://www.freshersworld.com");
    // ---------------click the jobs from navbar---------------
        await tab.waitForSelector('.nav-links.custom_padding_navlinks');
        let navs = await tab.$$('.nav-links.custom_padding_navlinks');
        let navurl=[];
        for(let i=0;i<navs.length;i++){
            let url = await tab.evaluate(function(ele){
                return ele.getAttribute("href"); 
             },navs[i])
             navurl.push(url);
        }
        await tab.goto(navurl[0]);
    // --------------click the IT job section ------------------
        await tab.waitForSelector(".panel-body.panel_jobs ul li a", {visible:true});
        let jobtables = await tab.$$('.panel-body.panel_jobs ul li a');  // array of 9 elements
            //    console.log(jobtables.length);
        
        let categoryurl=[];
        for(let i=0;i<jobtables.length;i++){
            let url = await tab.evaluate(function(ele){
            return ele.getAttribute("href"); 
            },jobtables[i])
            categoryurl.push(url);
        } 
        let link ="";
        for(let i=0; i<jobtables.length;i++){
            if(i==31)
            {      link = await tab.evaluate(function(ele){
                    return ele.getAttribute("href"); 
                    },jobtables[i])   
            } 
            else
                continue;   
        }
        console.log(link);
        await tab.goto(link);
        await tab.select('.form-control#sort-by-latest', 'latest')
   // -----------discard non web developer jobs-----------
        await tab.waitForSelector(".col-md-3.col-xs-3.col-lg-3.padding-none .view-apply-button.view-apply-button",{visible:true});
        let jobsdivs= await tab.$$(".col-md-3.col-xs-3.col-lg-3.padding-none .view-apply-button.view-apply-button");
              // console.log(jobsdivs.length);
        let arr =[];
        let arrlink="";
        for(let i=0;i<jobsdivs.length;i++){
             arrlink = await tab.evaluate((element)=>{
                return element.getAttribute('href');
               },jobsdivs[i])
               arr.push(arrlink);
        }
             //    console.log(arr.length);
        let webjobarray=[];
        let webjoburl="";
        for(let i=0;i<arr.length;i++){
            let href = arr[i];
            let targetstr='developer';
            let flag = strmatch(href,targetstr);
            if(flag){
                webjoburl=href;
                webjobarray.push(webjoburl);}
            else
                continue;
        }
             // console.log(webjobarray);

    // ------------- Navigate the selected webdeveloper url  and store data in json file------------
            const tab2 = await browser.newPage();       // open new tab
            let jsonobj =[]
        for(let i=0; i<webjobarray.length; i++){
                let href=webjobarray[i];
                 let job_info={}; // make object of every web dev job
                 job_info[i]=href;

                 await tab2.goto(href);

            // await tab.waitForSelector(".col-md-12.col-lg-12.col-xs-12.padding-none.job-container.adsblockshow",{visible:true});
            // let prof = await tab.$$(".col-md-12.col-lg-12.col-xs-12.padding-none.job-container.adsblockshow>div>div>span");
            // let loc = await tab.$$(".col-md-12.col-lg-12.col-xs-12.padding-none.job-container.adsblockshow div>span>a");
            
            // let prof_value = await tab.evaluate(()=>{
            //     return  document.querySelector(".col-md-12.col-lg-12.col-xs-12.padding-none.job-container.adsblockshow>div>div>span").innerText;
            //    },prof_value)   
            // let loc_value = await tab.evaluate(()=>{
            //     return  document.querySelector(".col-md-12.col-lg-12.col-xs-12.padding-none.job-container.adsblockshow div>span>a").innerText;
            //    },loc)   

            // job_info["profile"]=prof_value;
            // job_info["Location"]=loc_value;
            // job_info["link"]=href[i];
    
            jsonobj.push(job_info);
        }
        console.log(jsonobj);
        // fs.writeFileSync("jsonfile.json", JSON.stringify(jsonobj));
    }// main method

    main();

        function strmatch(a,b){
            return (a.includes(b))
        }  
    
